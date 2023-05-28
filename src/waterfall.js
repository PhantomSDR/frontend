
import getColormap, { computeColormapArray } from './lib/colormaps.js'
import { createWaterfallDecoder } from './lib/wrappers.js'
import Deque from 'double-ended-queue'
import 'core-js/actual/set-immediate'
import 'core-js/actual/clear-immediate'

export default class SpectrumWaterfall {
  constructor (endpoint, settings) {
    this.endpoint = endpoint

    this.spectrum = false
    this.waterfall = false

    this.waterfallQueue = new Deque(10)
    this.drawnWaterfallQueue = new Deque(4096)
    this.lagTime = 0
    this.spectrumAlpha = 0.5
    this.spectrumFiltered = [[-1, -1], [0]]

    this.waterfallColourShift = 80
    // https://gist.github.com/mikhailov-work/ee72ba4191942acecc03fe6da94fc73f
    this.colormap = []

    this.setColormap('gqrx')

    this.clients = {}
    this.clientColormap = computeColormapArray(getColormap('rainbow'))

    this.updateTimeout = setTimeout(() => {}, 0)

    this.lineResets = 0
  }

  initCanvas (settings) {
    this.canvasElem = settings.canvasElem
    this.ctx = this.canvasElem.getContext('2d')
    this.canvasWidth = this.canvasElem.width
    this.canvasHeight = this.canvasElem.height
    this.backgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    this.curLine = this.canvasHeight / 2

    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height)

    this.graduationCanvasElem = settings.graduationCanvasElem
    this.graduationCtx = this.graduationCanvasElem.getContext('2d')

    this.spectrumCanvasElem = settings.spectrumCanvasElem
    this.spectrumCtx = this.spectrumCanvasElem.getContext('2d')

    this.spectrumCanvasElem.addEventListener('mousemove', this.spectrumMouseMove.bind(this))
    this.spectrumCanvasElem.addEventListener('mouseleave', this.spectrumMouseLeave.bind(this))

    this.tempCanvasElem = document.createElement('canvas')
    this.tempCtx = this.tempCanvasElem.getContext('2d')
    this.tempCanvasElem.width = this.canvasWidth
    this.tempCanvasElem.height = 200

    this.waterfall = true

    /*window.addEventListener('resize', () => {
      this.canvasElem.height = window.innerHeight * 2
      this.canvasHeight = this.canvasElem.height
      this.redrawWaterfall()
    })*/
  }

  async init () {
    if (this.promise) {
      return this.promise
    }

    this.waterfallSocket = new WebSocket(this.endpoint)
    this.waterfallSocket.binaryType = 'arraybuffer'
    this.firstWaterfallMessage = true
    this.waterfallSocket.onmessage = this.socketMessageInitial.bind(this)

    this.promise = new Promise((resolve, reject) => {
      this.resolvePromise = resolve
      this.rejectPromise = reject
    })

    return this.promise
  }

  stop () {
    this.waterfallSocket.close()
  }

  socketMessageInitial (event) {
    // First message gives the parameters in json
    if (!(event.data instanceof ArrayBuffer)) {
      const settings = JSON.parse(event.data)
      if (!settings.fft_size) {
        return
      }
      this.waterfallMaxSize = settings.fft_result_size
      this.fftSize = settings.fft_size
      this.baseFreq = settings.basefreq
      this.sps = settings.sps
      this.totalBandwidth = settings.total_bandwidth
      this.overlap = settings.overlap

      this.canvasElem.width = settings.waterfall_size
      this.spectrumCanvasElem.width = settings.waterfall_size
      this.tempCanvasElem.width = settings.waterfall_size
      this.graduationCanvasElem.width = settings.waterfall_size

      this.canvasElem.height = this.canvasElem.parentElement.clientHeight * 2
      this.canvasWidth = this.canvasElem.width
      this.canvasHeight = this.canvasElem.height

      this.ctx.fillStyle = this.backgroundColor
      this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height)

      const skipNum = Math.max(1, Math.floor((this.sps / this.fftSize) / 10.0) * 2)
      const waterfallFPS = (this.sps / this.fftSize) / (skipNum / 2)

      console.log('Waterfall FPS: ' + waterfallFPS)

      this.waterfallDrawInterval = setInterval(() => {
        requestAnimationFrame(this.drawSpectrogram.bind(this))
      }, 1000 / waterfallFPS)

      this.waterfallL = 0
      this.waterfallR = this.waterfallMaxSize
      this.waterfallSocket.onmessage = this.socketMessage.bind(this)
      this.firstWaterfallMessage = false

      this.waterfallDecoder = createWaterfallDecoder(settings.waterfall_compression)
      this.updateGraduation()
      this.resolvePromise(settings)
    }
  }

  socketMessage (event) {
    if (event.data instanceof ArrayBuffer) {
      this.enqueueSpectrogram(event.data)
    }
  }

  getMouseX (canvas, evt) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width

    return (evt.clientX - rect.left) * scaleX
  }
  
  enqueueSpectrogram (array) {
    // Do not decode or draw if not requested
    if (!this.waterfall && !this.spectrum) {
      this.waterfallQueue.clear()
      return
    }
    if (this.waterfallQueue.length > 20) {
      this.waterfallQueue.pop()
      this.waterfallQueue.pop()
    }


    function decodePacket (packet) {
      let packetview = new DataView(packet.buffer);
      let l = packetview.getUint32(8, true);
      let r = packetview.getUint32(12, true);
      return [new Int8Array(packet.buffer, 16), l, r]
    }

    // Decode and extract header
    this.waterfallDecoder.decode(array).map(decodePacket).forEach((element) => {
      this.waterfallQueue.unshift(element)
    })
  }

  transformValue (x) {
    return Math.min(Math.max(x + this.waterfallColourShift, 0), 255)
  }

  // Helper functions

  idxToFreq (idx) {
    return idx / this.waterfallMaxSize * this.totalBandwidth + this.baseFreq
  }

  idxToCanvasX (idx) {
    return (idx - this.waterfallL) / (this.waterfallR - this.waterfallL) * this.canvasWidth
  }

  canvasXtoFreq (x) {
    const idx = x / this.canvasWidth * (this.waterfallR - this.waterfallL) + this.waterfallL
    return this.idxToFreq(idx)
  }

  freqToIdx (freq) {
    return (freq - this.baseFreq) / (this.totalBandwidth) * this.waterfallMaxSize
  }

  // Drawing functions
  calculateOffsets (waterfallArray, curL, curR) {
    // Correct for zooming or shifting
    const pxPerIdx = this.canvasWidth / (this.waterfallR - this.waterfallL)
    const pxL = (curL - this.waterfallL) * pxPerIdx
    const pxR = (curR - this.waterfallL) * pxPerIdx

    const arr = new Uint8Array(waterfallArray.length)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = this.transformValue(waterfallArray[i])
    }
    return [arr, pxL, pxR]
  }

  drawSpectrogram () {
    if (this.waterfallQueue.length === 0) {
      return
    }

    const [waterfallArray, curL, curR] = this.waterfallQueue.pop()

    const [arr, pxL, pxR] = this.calculateOffsets(waterfallArray, curL, curR)
    
    if (this.waterfall) {
      this.drawWaterfall(arr, pxL, pxR, curL, curR)
    }
    if (this.spectrum) {
      this.drawSpectrum(arr, pxL, pxR, curL, curR)
    }

    this.drawnWaterfallQueue.unshift([waterfallArray, curL, curR])

    if (this.drawnWaterfallQueue.length > this.canvasHeight) {
      this.drawnWaterfallQueue.pop()
    }
  }

  async redrawWaterfall () {
    const toDraw = this.drawnWaterfallQueue.toArray()
    const curLineReset = this.lineResets
    const curLine = this.curLine
    const drawLine = (i) => {
      const toDrawLine = curLine + 1 + i + (this.lineResets - curLineReset) * this.canvasHeight / 2

      const [waterfallArray, curL, curR] = toDraw[i]

      const [arr, pxL, pxR] = this.calculateOffsets(waterfallArray, curL, curR)

      this.drawWaterfallLine(arr, pxL, pxR, toDrawLine)
      if (i + 1 < toDraw.length) {
        this.updateImmediate = setImmediate(() => drawLine(i + 1))
      }
    }
    clearImmediate(this.updateImmediate)
    if (toDraw.length) {
      drawLine(0)
    }
  }

  drawWaterfallLine (arr, pxL, pxR, line) {
    // Draw the new line
    const colorarr = this.ctx.createImageData(arr.length, 1)

    const bmparr = new Uint8Array(arr.length * 4)
    for (let i = 0; i < arr.length; i++) {
      colorarr.data.set(this.colormap[arr[i]], i * 4)

      bmparr[i * 4 + 0] = 255
      bmparr[i * 4 + 1] = this.colormap[arr[i]][2]
      bmparr[i * 4 + 2] = this.colormap[arr[i]][1]
      bmparr[i * 4 + 3] = this.colormap[arr[i]][0]
    }

    this.ctx.putImageData(colorarr, 0, 0)
    // Resize the line into the correct width
    this.ctx.drawImage(this.canvasElem, 0, 0, arr.length, 1, pxL, line, pxR - pxL, 1)
  }

  drawWaterfall (arr, pxL, pxR, curL, curR) {
    this.drawWaterfallLine(arr, pxL, pxR, this.curLine)

    // Shift the spectrogram down by 1 pixel
    this.canvasElem.style.transform = `translate3d(0, -${((this.curLine + 1) / this.canvasHeight * 100).toFixed(8)}%, 0)`

    // Once we have reached the start of the canvas, reset to the middle
    if (this.curLine === 0) {
      this.ctx.drawImage(this.canvasElem, 0, this.canvasHeight / 2)
      this.curLine = this.canvasHeight / 2
      this.lineResets++
    }
    this.curLine -= 1
  }

  drawSpectrum (arr, pxL, pxR, curL, curR) {
    if (curL !== this.spectrumFiltered[0][0] || curR !== this.spectrumFiltered[0][1]) {
      this.spectrumFiltered[1] = arr
      this.spectrumFiltered[0] = [curL, curR]
    }

    // Smooth the spectrogram with the previous values
    for (let i = 0; i < arr.length; i++) {
      this.spectrumFiltered[1][i] = this.spectrumAlpha * arr[i] + (1 - this.spectrumAlpha) * this.spectrumFiltered[1][i]
    }

    // Take the smoothed value
    arr = this.spectrumFiltered[1]

    const pixels = (pxR - pxL) / arr.length

    arr = arr.map((x) => 255 - x)

    // Blank the screen
    this.spectrumCtx.clearRect(0, 0, this.spectrumCanvasElem.width, this.spectrumCanvasElem.height)
    this.spectrumCtx.strokeStyle = 'yellow'
    this.spectrumCtx.fillStyle = 'yellow'

    // Draw the line
    this.spectrumCtx.beginPath()
    this.spectrumCtx.moveTo(pxL, arr[0] / 2)
    arr.forEach((x, i) => {
      this.spectrumCtx.lineTo(pxL + pixels / 2 + i * pixels, x / 2)
    })
    this.spectrumCtx.lineTo(pxR, arr[arr.length - 1] / 2)
    this.spectrumCtx.stroke()

    if (this.spectrumFreq) {
      this.spectrumCtx.fillText((this.spectrumFreq / 1e6).toFixed(8) + ' MHz', 10, 10)
      this.spectrumCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      this.spectrumCtx.beginPath()
      this.spectrumCtx.moveTo(this.spectrumX, 0)
      this.spectrumCtx.lineTo(this.spectrumX, 128)
      this.spectrumCtx.stroke()
    }
  }

  updateGraduation () {
    const freqL = this.idxToFreq(this.waterfallL)
    const freqR = this.idxToFreq(this.waterfallR)

    let graduationSpacing = 1

    // Calculate the scale where at least 20 graduation spacings will be drawn
    while ((freqR - freqL) / graduationSpacing > 8) {
      graduationSpacing *= 10
    }
    graduationSpacing /= 10

    this.graduationCtx.fillStyle = 'white'
    this.graduationCtx.strokeStyle = 'white'
    this.graduationCtx.clearRect(0, 0, this.graduationCanvasElem.width, this.graduationCanvasElem.height)

    // Find the first graduation frequency
    let freqLStart = freqL
    if (freqL % graduationSpacing !== 0) {
      freqLStart = freqL + (graduationSpacing - (freqL % graduationSpacing))
    }

    // Find the least amount of trailing zeros
    let minimumTrailingZeros = 5
    for (let freqStart = freqLStart; freqStart <= freqR; freqStart += graduationSpacing) {
      if (freqStart != 0) {
        const trailingZeros = freqStart.toString().match(/0*$/g)[0].length
        minimumTrailingZeros = Math.min(minimumTrailingZeros, trailingZeros)
      }
    }
    
    this.graduationCtx.font = '15px Arial'
    for (; freqLStart <= freqR; freqLStart += graduationSpacing) {
      // find the middle pixel
      const middlePixel = (freqLStart - freqL) / (freqR - freqL) * this.canvasWidth

      let lineHeight = 5
      let printFreq = false
      if (freqLStart % (graduationSpacing * 10) === 0) {
        lineHeight = 10
        printFreq = true
      } else if (freqLStart % (graduationSpacing * 5) === 0) {
        lineHeight = 7
        printFreq = true
      }

      if (printFreq) {
        this.graduationCtx.textAlign = 'center'
        this.graduationCtx.fillText((freqLStart / 1000000).toFixed(6 - minimumTrailingZeros) + ' MHz', middlePixel, 10)
      }
      // draw a line in the middle of it
      this.graduationCtx.beginPath()
      this.graduationCtx.moveTo(middlePixel, 10 + 0)
      this.graduationCtx.lineTo(middlePixel, 10 + lineHeight)
      this.graduationCtx.stroke()
    }

    this.drawClients()
  }

  setClients (clients) {
    this.clients = clients
  }

  drawClients () {
    Object.entries(this.clients)
      .filter(([_, x]) => (x[1] < this.waterfallR && x[1] >= this.waterfallL))
      .forEach(([id, range]) => {
        const midOffset = this.idxToCanvasX(range[1])
        const [r, g, b, a] = this.clientColormap[parseInt(id.substring(0, 2), 16)]
        this.graduationCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        this.graduationCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        this.graduationCtx.beginPath()
        this.graduationCtx.moveTo(midOffset, 0)
        this.graduationCtx.lineTo(midOffset + 2, 5)
        this.graduationCtx.stroke()
        this.graduationCtx.beginPath()
        this.graduationCtx.moveTo(midOffset, 0)
        this.graduationCtx.lineTo(midOffset - 2, 5)
        this.graduationCtx.stroke()
        // this.graduationCtx.arc(midOffset, 2, 2, 0, 2 * Math.PI, 0)
        // this.graduationCtx.fill()
      })
  }

  setWaterfallRange (waterfallL, waterfallR) {
    if (waterfallL >= waterfallR) {
      return
    }
    const width = waterfallR - waterfallL
    // If there is out of bounds, fix the bounds
    if (waterfallL < 0 && waterfallR > this.waterfallMaxSize) {
      waterfallL = 0
      waterfallR = this.waterfallMaxSize
    } else if (waterfallL < 0) {
      waterfallL = 0
      waterfallR = width
    } else if (waterfallR > this.waterfallMaxSize) {
      waterfallR = this.waterfallMaxSize
      waterfallL = waterfallR - width
    }
    const prevL = this.waterfallL
    const prevR = this.waterfallR
    this.waterfallL = waterfallL
    this.waterfallR = waterfallR
    this.waterfallSocket.send(JSON.stringify({
      cmd: 'window',
      l: this.waterfallL,
      r: this.waterfallR
    }))

    const newCanvasX1 = this.idxToCanvasX(prevL)
    const newCanvasX2 = this.idxToCanvasX(prevR)
    const newCanvasWidth = newCanvasX2 - newCanvasX1

    this.ctx.drawImage(this.canvasElem, 0, 0, this.canvasWidth, this.canvasHeight, newCanvasX1, 0, newCanvasWidth, this.canvasHeight)

    // Special case for zoom out or panning, blank the borders
    if ((prevR - prevL) <= (waterfallR - waterfallL) + 1) {
      this.ctx.fillStyle = this.backgroundColor
      this.ctx.fillRect(0, 0, newCanvasX1, this.canvasHeight)
      this.ctx.fillRect(newCanvasX2, 0, this.canvasWidth - newCanvasX2, this.canvasHeight)
    }
    this.updateGraduation()
    this.resetRedrawTimeout(500)
  }

  getWaterfallRange () {
    return [this.waterfallL, this.waterfallR]
  }

  setWaterfallLagTime (lagTime) {
    this.lagTime = Math.max(0, lagTime)
  }

  setOffset (offset) {
    this.waterfallColourShift = offset
    this.resetRedrawTimeout(100)
  }

  setAlpha (alpha) {
    this.spectrumAlpha = alpha
  }

  setColormapArray (colormap) {
    this.colormap = computeColormapArray(colormap)
  }

  setColormap (name) {
    this.setColormapArray(getColormap(name))
    this.resetRedrawTimeout(50)
  }

  setUserID (userID) {
    this.waterfallSocket.send(JSON.stringify({
      cmd: 'userid',
      userid: userID
    }))
  }

  setSpectrum (spectrum) {
    this.spectrum = spectrum
  }

  setWaterfall (waterfall) {
    this.waterfall = waterfall
  }

  resetRedrawTimeout (timeout) {
    if (this.updateTimeout !== undefined) {
      clearTimeout(this.updateTimeout)
    }
    this.updateTimeout = setTimeout(this.redrawWaterfall.bind(this), timeout)
  }

  canvasWheel (e) {
    // For UI to pass custom zoom range
    const x = (e.coords || { x: this.getMouseX(this.spectrumCanvasElem, e) }).x
    e.preventDefault()

    const zoomAmount = e.deltaY || e.scale
    const l = this.waterfallL
    const r = this.waterfallR
    // For UI to pass in a custom scale amount
    const scale = e.scaleAmount || 0.85

    // Prevent zooming beyond a certain point
    if (r - l <= 128 && zoomAmount < 0) {
      return false
    }
    const centerfreq = (r - l) * x / this.canvasWidth + l
    let widthL = centerfreq - l
    let widthR = r - centerfreq
    if (zoomAmount < 0) {
      widthL *= scale
      widthR *= scale
    } else if (zoomAmount > 0) {
      widthL *= 1 / scale
      widthR *= 1 / scale
    }
    const waterfallL = Math.round(centerfreq - widthL)
    const waterfallR = Math.round(centerfreq + widthR)

    this.setWaterfallRange(waterfallL, waterfallR)

    return false
  }

  mouseMove (e) {
    // Figure out how much is dragged
    const mouseMovement = e.movementX
    const frequencyMovement = Math.round(mouseMovement / this.canvasElem.getBoundingClientRect().width * (this.waterfallR - this.waterfallL))

    if (!frequencyMovement) {
      return
    }
    const newL = this.waterfallL - frequencyMovement
    const newR = this.waterfallR - frequencyMovement
    this.setWaterfallRange(newL, newR)
  }

  spectrumMouseMove (e) {
    const x = this.getMouseX(this.spectrumCanvasElem, e)
    const freq = this.canvasXtoFreq(x)
    this.spectrumFreq = freq
    this.spectrumX = x
  }

  spectrumMouseLeave (e) {
    this.spectrumFreq = undefined
    this.spectrumX = undefined
  }
}
