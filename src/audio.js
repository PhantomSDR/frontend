import { createFlacDecoder, createOpusDecoder, createResampler, LiquidDSP } from './lib/wrappers'
import AudioProcessor from './lib/AudioProcessor'

import createWindow from 'live-moving-average'

import { MinimalAudioContext, ConvolverNode, AudioContext, IIRFilterNode, GainNode, AudioBuffer, AudioBufferSourceNode } from 'standardized-audio-context'

export default class SpectrumAudio {
  constructor (endpoint) {
    this.endpoint = endpoint

    this.playAmount = 0

    this.playMovingAverage = []
    this.playSampleLength = 1
    this.audioQueue = []

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

    this.lastdebug = 0
  }

  async init () {
    if (this.promise) {
      return this.promise
    }

    this.audioProcessor = new AudioProcessor()

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

  stop () {
    this.audioSocket.close()
    this.decoder.destroy()
    if (this.resampler) {
      this.resampler.destroy()
    }
  }

  initAudio (settings) {
    const sampleRate = this.audioOutputSps
    try {
      this.audioCtx = new MinimalAudioContext({
        sampleRate: sampleRate
      })
    } catch {
      this.resolvePromise()
      return
    }

    // this.decoder = createFlacDecoder()

    if (settings.audio_compression === 'flac') {
      this.decoder = createFlacDecoder()
    } else if (settings.audio_compression === 'opus') {
      this.decoder = createOpusDecoder(Math.min(this.trueAudioSps, 48000))
    }

    this.audioStartTime = this.audioCtx.currentTime
    this.playTime = this.audioCtx.currentTime + 0.1
    this.playStartTime = this.audioCtx.currentTime

    this.gainNode = new GainNode(this.audioCtx)
    this.setGain(10)
    this.gainNode.connect(this.audioCtx.destination)

    this.convolverNode = new ConvolverNode(this.audioCtx)
    this.setLowpass(15000)
    this.convolverNode.connect(this.gainNode)

    this.audioInputNode = this.convolverNode

    // this.wbfmStereo = new LiquidDSP.WBFMStereo(this.trueAudioSps)

    if (this.trueAudioSps > 96000) {
      createResampler(this.trueAudioSps, 96000, 1).then((src) => {
        this.resampler = src
        this.resolvePromise(settings)
      })
    } else {
      this.resolvePromise(settings)
    }
  }

  setFIRFilter (fir) {
    const firAudioBuffer = new AudioBuffer({ length: fir.length, numberOfChannels: 1, sampleRate: this.audioOutputSps })
    firAudioBuffer.copyToChannel(fir, 0, 0)
    this.convolverNode.buffer = firAudioBuffer
  }

  setLowpass (lowpass) {
    const sampleRate = this.audioOutputSps
    // Bypass the FIR filter if the sample rate is low enough
    if (lowpass >= sampleRate / 2) {
      lowpass = sampleRate / 2
    }
    const fir = LiquidDSP.FirDesKaiser(1000 / sampleRate, lowpass / sampleRate, 60, 0)
    this.setFIRFilter(fir)
  }

  setFmDeemph (tau) {
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

  socketMessageInitial (event) {
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

    this.initAudio(settings)

    console.log('Audio Samplerate: ', this.trueAudioSps)
  }

  socketMessage (event) {
    if (event.data instanceof ArrayBuffer) {
      const floats = new Float64Array(event.data.slice(0, 3 * 8))
      // const ints = new Int32Array(event.data.slice(0, 3 * 8))
      const bytes = new Uint8Array(event.data)

      const receivedPower = floats[2]
      this.power = 0.5 * this.power + 0.5 * receivedPower || 1
      const dBpower = 20 * Math.log10(Math.sqrt(this.power) / 2)
      this.dBPower = dBpower
      if (this.squelch && dBpower < this.squelchThreshold) {
        this.squelchMute = true
      } else {
        this.squelchMute = false
      }

      if (!this.audioCtx) return

      const encodedArray = bytes.subarray(3 * 8)
      this.decode(encodedArray)
    }
  }

  decode (encoded) {
    let sample = new Int16Array()
    try {
      sample = this.decoder.decode(encoded)
    } catch (err) {
      return
    }
    // If the decoder does not output samples, return immediately
    if (sample.length === 0) {
      return
    }

    // Scale the array
    let pcmArray = new Float32Array(sample)
    pcmArray = pcmArray.map(x => x / 65536)

    // Resample

    this.intervals = this.intervals || createWindow(10000, 0)
    this.lens = this.lens || createWindow(10000, 0)
    this.lastReceived = this.lastReceived || 0
    // For checking sample rate
    if (this.lastReceived === 0) {
      this.lastReceived = performance.now()
    } else {
      const curReceived = performance.now()
      const delay = curReceived - this.lastReceived
      this.intervals.push(delay)
      this.lastReceived = curReceived
      this.lens.push(pcmArray.length)

      let updatedv = true

      if (this.mode === 0) {
        if (Math.abs(delay - this.n1) > Math.abs(this.v) * 2 + 800) {
          this.var = 0
          this.mode = 1
        }
      } else {
        this.var = this.var / 2 + Math.abs((2 * delay - this.n1 - this.n2) / 8)
        if (this.var <= 63) {
          this.mode = 0
          updatedv = false
        }
      }

      if (updatedv) {
        if (this.mode === 0) {
          this.d = 0.125 * delay + 0.875 * this.d
        } else {
          this.d = this.d + delay - this.n1
        }
        this.v = 0.125 * Math.abs(delay - this.d) + 0.875 * this.v
      }

      this.n2 = this.n1
      this.n1 = delay
    }

    this.pcmArray = pcmArray
    if (this.signalDecoder) {
      this.signalDecoder.decode(pcmArray)
    }
    if (this.resampler) {
      pcmArray = this.resampler.resample(pcmArray)
    }
    pcmArray = this.audioProcessor.process(pcmArray)

    this.playAudio(pcmArray)
  }

  updateAudioParams () {
    this.audioSocket.send(JSON.stringify({
      cmd: 'window',
      l: this.audioL,
      m: this.audioM,
      r: this.audioR
    }))
  }

  setAudioDemodulation (demodulation) {
    this.demodulation = demodulation
    this.audioSocket.send(JSON.stringify({
      cmd: 'demodulation',
      demodulation: demodulation
    }))
  }

  setAudioRange (audioL, audioM, audioR) {
    this.audioL = audioL
    this.audioM = audioM
    this.audioR = audioR
    this.updateAudioParams()
  }

  getAudioRange () {
    return [this.audioL, this.audioM, this.audioR]
  }

  setAudioOptions (options) {
    this.audioOptions = options
    this.audioSocket.send(JSON.stringify({
      cmd: 'options',
      options: options
    }))
  }

  setGain (gain) {
    this.gain = gain
    this.gainNode.gain.value = gain
  }

  setMute (mute) {
    if (mute === this.mute) {
      return
    }
    this.mute = mute
    this.audioSocket.send(JSON.stringify({
      cmd: 'mute',
      mute: mute
    }))
  }

  setSquelch (squelch) {
    this.squelch = squelch
  }

  setSquelchThreshold (squelchThreshold) {
    this.squelchThreshold = squelchThreshold
  }

  getPowerDb () {
    return this.dBPower
  }

  setUserID (userID) {
    this.audioSocket.send(JSON.stringify({
      cmd: 'userid',
      userid: userID
    }))
  }

  setSignalDecoder (decoder) {
    this.signalDecoder = decoder
  }

  getSignalDecoder () {
    return this.signalDecoder
  }

  playAudio (pcmArray) {
    if (this.mute || (this.squelchMute && this.squelch)) {
      return
    }
    if (this.audioCtx.state !== 'running') {
      return
    }

    const curPlayTime = this.playPCM(pcmArray, this.playTime, this.audioOutputSps, 1)

    // buffering issues
    if (this.playTime - this.audioCtx.currentTime <= curPlayTime) {
      this.playTime = this.audioCtx.currentTime + (this.d + 4 * this.v) / 1000
      console.log('underrun')
    } else if (this.playTime - this.audioCtx.currentTime > 2) {
      this.playTime = this.audioCtx.currentTime + (this.d + 4 * this.v) / 1000
      console.log('overrun')
    }
  }

  playPCM (buffer, playTime, sampleRate, scale) {
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
