import { JitterBuffer, createDecoder, firdes_kaiser_lowpass } from './lib/wrappers'

import createWindow from 'live-moving-average'

import { MinimalAudioContext, ConvolverNode, IIRFilterNode, GainNode, AudioBuffer, AudioBufferSourceNode } from 'standardized-audio-context'

export default class SpectrumAudio {
  constructor(endpoint) {
    this.endpoint = endpoint

    this.playAmount = 0

    this.playMovingAverage = []
    this.playSampleLength = 1
    this.audioQueue = new JitterBuffer(100)

    this.demodulation = 'USB'

    // Audio controls
    this.mute = false
    this.squelchMute = false
    this.squelch = false
    this.squelchThreshold = 0
    this.power = 1

    // for chrome
    const userGestureFunc = () => {
      if (this.audioCtx && this.audioCtx.state !== 'running') {
        this.audioCtx.resume()
      }
      document.documentElement.removeEventListener('mousedown', userGestureFunc)
    }
    document.documentElement.addEventListener('mousedown', userGestureFunc)

    this.mode = 0
    this.d = 10
    this.v = 10
    this.n2 = 10
    this.n1 = 10
    this.var = 10
    this.highThres = 1
  }

  async init() {
    if (this.promise) {
      return this.promise
    }

    this.promise = new Promise((resolve, reject) => {
      this.resolvePromise = resolve
      this.rejectPromise = reject
    })

    this.audioSocket = new WebSocket(this.endpoint)
    this.audioSocket.binaryType = 'arraybuffer'
    this.firstAudioMessage = true
    this.audioSocket.onmessage = this.socketMessageInitial.bind(this)

    return this.promise
  }

  stop() {
    this.audioSocket.close()
    this.decoder.free()
  }

  initAudio(settings) {
    const sampleRate = this.audioOutputSps
    try {
      this.audioCtx = new MinimalAudioContext({
        sampleRate: sampleRate
      })
    } catch {
      this.resolvePromise()
      return
    }

    this.audioStartTime = this.audioCtx.currentTime
    this.playTime = this.audioCtx.currentTime + 0.25
    this.playStartTime = this.audioCtx.currentTime

    this.decoder = createDecoder(settings.audio_compression, this.audioMaxSps, this.trueAudioSps, this.audioOutputSps)
    
    // inputNode -> fmDeemphNode -> convolverNode -> gainNode -> audioCtx.destination

    this.gainNode = new GainNode(this.audioCtx)
    this.setGain(10)
    this.gainNode.connect(this.audioCtx.destination)

    this.convolverNode = new ConvolverNode(this.audioCtx)
    this.setLowpass(15000)
    this.convolverNode.connect(this.gainNode)

    this.audioInputNode = this.convolverNode

    // this.wbfmStereo = new LiquidDSP.WBFMStereo(this.trueAudioSps)

    this.resolvePromise(settings)
  }

  setFIRFilter(fir) {
    const firAudioBuffer = new AudioBuffer({ length: fir.length, numberOfChannels: 1, sampleRate: this.audioOutputSps })
    firAudioBuffer.copyToChannel(fir, 0, 0)
    this.convolverNode.buffer = firAudioBuffer
  }

  setLowpass(lowpass) {
    const sampleRate = this.audioOutputSps
    // Bypass the FIR filter if the sample rate is low enough
    if (lowpass >= sampleRate / 2) {
      this.setFIRFilter(Float32Array.of(1))
      return
    }
    const fir = firdes_kaiser_lowpass(lowpass / sampleRate, 1000 / sampleRate, 0.001)
    this.setFIRFilter(fir)
  }

  setFmDeemph(tau) {
    if (tau === 0) {
      this.audioInputNode = this.convolverNode
      return
    }
    // FM deemph https://github.com/gnuradio/gnuradio/blob/master/gr-analog/python/analog/fm_emph.py
    // Digital corner frequency
    const wc = 1.0 / tau
    const fs = this.audioOutputSps

    // Prewarped analog corner frequency
    const wca = 2.0 * fs * Math.tan(wc / (2.0 * fs))

    // Resulting digital pole, zero, and gain term from the bilinear
    // transformation of H(s) = w_ca / (s + w_ca) to
    // H(z) = b0 (1 - z1 z^-1)/(1 - p1 z^-1)
    const k = -wca / (2.0 * fs)
    const z1 = -1.0
    const p1 = (1.0 + k) / (1.0 - k)
    const b0 = -k / (1.0 - k)

    const feedForwardTaps = [b0 * 1.0, b0 * -z1]
    const feedBackwardTaps = [1.0, -p1]

    this.fmDeemphNode = new IIRFilterNode(this.audioCtx, { feedforward: feedForwardTaps, feedback: feedBackwardTaps })
    this.fmDeemphNode.connect(this.convolverNode)

    this.audioInputNode = this.fmDeemphNode
  }

  socketMessageInitial(event) {
    // first message gives the parameters in json
    const settings = JSON.parse(event.data)
    this.settings = settings
    this.fftSize = settings.fft_size
    this.audioMaxSize = settings.fft_result_size
    this.baseFreq = settings.basefreq
    this.totalBandwidth = settings.total_bandwidth
    this.sps = settings.sps
    this.audioOverlap = settings.fft_overlap / 2
    this.audioMaxSps = settings.audio_max_sps

    this.audioL = settings.defaults.l
    this.audioM = settings.defaults.m
    this.audioR = settings.defaults.r

    const targetFFTBins = Math.ceil(this.audioMaxSps * this.audioMaxSize / this.sps / 4) * 4

    this.trueAudioSps = targetFFTBins / this.audioMaxSize * this.sps
    this.audioOutputSps = Math.min(this.audioMaxSps, 96000)

    this.audioSocket.onmessage = this.socketMessage.bind(this)

    const skipNum = Math.max(1, Math.floor((this.sps / this.fftSize) / 10.0) * 2)
    const waterfallFPS = (this.sps / this.fftSize) / (skipNum / 2)
    this.audioQueue = new JitterBuffer(1000 / waterfallFPS)

    this.initAudio(settings)

    console.log('Audio Samplerate: ', this.trueAudioSps)
  }

  socketMessage(event) {
    if (event.data instanceof ArrayBuffer) {
      /*
          struct {
            uint64_t frame_num;
            uint32_t l, r;
            double m, pwr;
          } header;
      */
      const header = new DataView(event.data)
      const receivedPower = header.getFloat64(8 + 4 * 2 + 8, true)
      this.power = 0.5 * this.power + 0.5 * receivedPower || 1
      const dBpower = 20 * Math.log10(Math.sqrt(this.power) / 2)
      this.dBPower = dBpower
      if (this.squelch && dBpower < this.squelchThreshold) {
        this.squelchMute = true
      } else {
        this.squelchMute = false
      }

      const packet = new Uint8Array(event.data.slice(4 * 8))
      this.decode(packet)
    }
  }

  decode(encoded) {
    // Audio not available
    if (!this.audioCtx) {
      return
    }
    let pcmArray = this.decoder.decode(encoded)
    // More samples needed
    if (pcmArray.length === 0) {
      return
    }
    
    this.audioQueue.unshift(pcmArray)
    pcmArray = this.audioQueue.pop()

    this.pcmArray = pcmArray
    if (this.signalDecoder) {
      this.signalDecoder.decode(pcmArray)
    }

    this.playAudio(pcmArray)
  }

  updateAudioParams() {
    this.audioSocket.send(JSON.stringify({
      cmd: 'window',
      l: this.audioL,
      m: this.audioM,
      r: this.audioR
    }))
  }

  setAudioDemodulation(demodulation) {
    this.demodulation = demodulation
    this.audioSocket.send(JSON.stringify({
      cmd: 'demodulation',
      demodulation: demodulation
    }))
  }

  setAudioRange(audioL, audioM, audioR) {
    this.audioL = audioL
    this.audioM = audioM
    this.audioR = audioR
    this.updateAudioParams()
  }

  getAudioRange() {
    return [this.audioL, this.audioM, this.audioR]
  }

  setAudioOptions(options) {
    this.audioOptions = options
    this.audioSocket.send(JSON.stringify({
      cmd: 'options',
      options: options
    }))
  }

  setGain(gain) {
    this.gain = gain
    this.gainNode.gain.value = gain
  }

  setMute(mute) {
    if (mute === this.mute) {
      return
    }
    this.mute = mute
    this.audioSocket.send(JSON.stringify({
      cmd: 'mute',
      mute: mute
    }))
  }

  setSquelch(squelch) {
    this.squelch = squelch
  }

  setSquelchThreshold(squelchThreshold) {
    this.squelchThreshold = squelchThreshold
  }

  getPowerDb() {
    return this.dBPower
  }

  setUserID(userID) {
    this.audioSocket.send(JSON.stringify({
      cmd: 'userid',
      userid: userID
    }))
  }

  setSignalDecoder(decoder) {
    this.signalDecoder = decoder
  }

  getSignalDecoder() {
    return this.signalDecoder
  }

  playAudio(pcmArray) {
    if (this.mute || (this.squelchMute && this.squelch)) {
      return
    }
    if (this.audioCtx.state !== 'running') {
      return
    }

    const curPlayTime = this.playPCM(pcmArray, this.playTime, this.audioOutputSps, 1)

    // buffering issues
    let buffer = Math.max(250, this.audioQueue.getavg() + this.audioQueue.getvar() * 2)
    if (this.playTime - this.audioCtx.currentTime <= curPlayTime) {
      this.playTime = this.audioCtx.currentTime + buffer / 1000
      console.log('underrun')
    } else if (this.playTime - this.audioCtx.currentTime > buffer * 2 / 1000) {
      this.playTime = this.audioCtx.currentTime + buffer / 1000
      console.log('overrun')
    }
  }

  playPCM(buffer, playTime, sampleRate, scale) {
    // Wait for the audio to be initialised
    if (!this.audioInputNode) {
      return
    }
    const source = new AudioBufferSourceNode(this.audioCtx)

    const audioBuffer = new AudioBuffer({ length: buffer.length, numberOfChannels: 1, sampleRate: this.audioOutputSps })
    audioBuffer.copyToChannel(buffer, 0, 0)

    source.buffer = audioBuffer
    source.start(playTime)
    this.playTime += audioBuffer.duration

    source.connect(this.audioInputNode)

    return audioBuffer.duration
  }
}
