<script>
  import { onDestroy, onMount } from 'svelte'
  import copy from 'copy-to-clipboard'
  import { RollingMax } from 'efficient-rolling-stats'

  import CheckButton from './lib/CheckButton.svelte'
  import LineThroughButton from './lib/LineThroughButton.svelte'
  import PassbandTuner from './lib/PassbandTuner.svelte'
  import FrequencyInput from './lib/FrequencyInput.svelte'
  import FrequencyMarkers from './lib/FrequencyMarkers.svelte'
  import Tooltip from './lib/Tooltip.svelte'
  import Popover from './lib/Popover.svelte'
  import Logger from './lib/Logger.svelte'

  import { pinch, pan } from './lib/hammeractions.js'
  import { availableColormaps, drawColormapPreview } from './lib/colormaps'
  import { init, audio, waterfall, events, FFTOffsetToFrequency, frequencyToFFTOffset, frequencyToWaterfallOffset, getMaximumBandwidth, waterfallOffsetToFrequency } from './lib/backend.js'
  import { constructLink, parseLink, storeInLocalStorage } from './lib/storage.js'

  let waterfallCanvas
  let spectrumCanvas
  let graduationCanvas

  let frequencyInputComponent

  let passbandTunerComponent
  let bandwidth
  let link
  
  // Updates the passband display
  function updatePassband (passband) {
    passband = passband || audio.getAudioRange()
    const frequencies = passband.map(FFTOffsetToFrequency)
    // Bandwidth display also needs updating
    bandwidth = ((frequencies[2] - frequencies[0]) / 1000).toFixed(2)
    // Passband Display
    const offsets = frequencies.map(frequencyToWaterfallOffset)
    passbandTunerComponent.changePassband(offsets)
  }
  // Wheel zooming, update passband and markers
  function handleWaterfallWheel (e) {
    waterfall.canvasWheel(e)
    passbandTunerComponent.updatePassbandLimits()
    updatePassband()
    frequencyMarkerComponent.updateFrequencyMarkerPositions()
  }

  // Handling dragging the waterfall left or right
  let waterfallDragging = false
  let waterfallDragTotal = 0
  function handleWaterfallMouseDown (e) {
    waterfallDragTotal = 0
    waterfallDragging = true
  }
  function handleWindowMouseMove (e) {
    if (waterfallDragging) {
      waterfallDragTotal += Math.abs(e.movementX) + Math.abs(e.movementY)
      waterfall.mouseMove(e)
      updatePassband()
      frequencyMarkerComponent.updateFrequencyMarkerPositions()
    }
  }
  function handleWindowMouseUp (e) {
    if (waterfallDragging) {
      // If mouseup without moving, handle as click
      if (waterfallDragTotal < 2) {
        passbandTunerComponent.handlePassbandClick(e)
      }
      waterfallDragging = false
    }
  }
  
  // Sidebar controls for waterfall and spectrum analyzer
  let waterfallDisplay = true
  let spectrumDisplay = false
  function handleSpectrumChange () {
    waterfall.setSpectrum(spectrumDisplay)
  }
  function handleWaterfallChange () {
    waterfall.setWaterfall(waterfallDisplay)
  }

  // Waterfall drawing
  let currentColormap = 'gqrx'
  let colormapPreview
  let alpha = 0.5
  let brightness = 80
  function handleWaterfallColormapSelect (event) {
    waterfall.setColormap(currentColormap)
    drawColormapPreview(currentColormap, colormapPreview)
  }

  // Waterfall slider controls
  function handleAlphaMove () {
    waterfall.setAlpha(1 - alpha)
  }
  function handleBrightnessMove () {
    waterfall.setOffset(brightness)
  }

  // Audio demodulation selection
  let demodulators = [
    'USB', 'LSB', 'CW-U', 'CW-L', 'AM', 'FM'
  ]
  const demodulationDefaults = {
    USB: { type: 'USB', offsets: [0, 3000] },
    LSB: { type: 'LSB', offsets: [3000, 0] },
    'CW-U': { type: 'USB', offsets: [-500, 1000] },
    'CW-L': { type: 'LSB', offsets: [1000, -500] },
    AM: { type: 'AM', offsets: [5000, 5000] },
    FM: { type: 'FM', offsets: [5000, 5000] },
    WBFM: { type: 'FM', offsets: [95000, 95000] }
  }
  let demodulation = 'USB'
  function roundAudioOffsets (offsets) {
    const [l, m, r] = offsets
    return [
      Math.floor(l),
      m,
      Math.floor(r)
    ]
  }

  // Demodulation controls
  function handleDemodulationChange (e, changed) {
    const demodulationDefault = demodulationDefaults[demodulation]
    if (changed) {
      if (demodulation === 'WBFM') {
        audio.setFmDeemph(50e-6)
      } else {
        audio.setFmDeemph(0)
      }
      audio.setAudioDemodulation(demodulationDefault.type)
    }
    let [l, m, r] = audio.getAudioRange().map(FFTOffsetToFrequency)
    l = m - demodulationDefault.offsets[0]
    r = m + demodulationDefault.offsets[1]

    const audioParameters = roundAudioOffsets([l, m, r].map(frequencyToFFTOffset))
    audio.setAudioRange(...audioParameters)
    updatePassband()
    updateLink()
  }

  // When user drags or changes the passband
  function handlePassbandChange (passband) {
    const [l, m, r] = passband.detail.map(waterfallOffsetToFrequency)
    bandwidth = ((r - l) / 1000).toFixed(2)
    frequencyInputComponent.setFrequency(m)
    const audioParameters = roundAudioOffsets([l, m, r].map(frequencyToFFTOffset))
    audio.setAudioRange(...audioParameters)
    updateLink()
  }

  // Entering new frequency into the textbox
  function handleFrequencyChange (event) {
    const frequency = event.detail
    const audioRange = audio.getAudioRange()
    const [l, m, r] = audioRange.map(FFTOffsetToFrequency)
  
    // Preserve current bandwidth settings
    let audioParameters = [
      frequency - (m - l),
      frequency,
      frequency + (r - m)
    ].map(frequencyToFFTOffset)
    const newm = audioParameters[1]

    // If the ranges are not within limit, shift it back
    let [waterfallL, waterfallR] = waterfall.getWaterfallRange()
    if ((newm < waterfallL || newm >= waterfallR)) {
      const limits = Math.floor((waterfallR - waterfallL) / 2)
      let offset
      if (audioRange[1] >= waterfallL && audioRange[1] < waterfallR) {
        offset = audioRange[1] - waterfallL
      } else {
        offset = limits
      }
      const newMid = Math.min(waterfall.waterfallMaxSize - limits, Math.max(limits, newm - offset + limits))

      waterfallL = Math.floor(newMid - limits)
      waterfallR = Math.floor(newMid + limits)
      waterfall.setWaterfallRange(waterfallL, waterfallR)
    }
    audioParameters = roundAudioOffsets(audioParameters)
    audio.setAudioRange(...audioParameters)
    updatePassband()
    updateLink()
  }

  // Waterfall magnification controls in the sidebar
  function handleWaterfallMagnify (e, type) {
    let [l, m, r] = audio.getAudioRange()
    const [waterfallL, waterfallR] = waterfall.getWaterfallRange()
    const offset = (m - waterfallL) / (waterfallR - waterfallL) * waterfall.canvasWidth
    switch (type) {
      case 'max':
        m = Math.min(waterfall.waterfallMaxSize - 512, Math.max(512, m))
        l = m - 512
        r = m + 512
        break
      case '+':
        e.coords = { x: offset }
        e.scale = -1
        waterfall.canvasWheel(e)
        updatePassband()
        return
      case '-':
        e.coords = { x: offset }
        e.scale = 1
        waterfall.canvasWheel(e)
        updatePassband()
        return
      case 'min':
        l = 0
        r = waterfall.waterfallMaxSize
        break
    }
    waterfall.setWaterfallRange(l, r)
    updatePassband()
  }

  let mute
  let volume = 75
  let squelchEnable
  let squelch = -50
  let power = 0
  let powerPeak = 0
  const accumulator = RollingMax(10)

  // Bandwidth offset controls
  let bandwithoffsets = [
    '-10000', '-100', '-10', '+10', '+100', '+10000'
  ]
  function handleBandwidthOffsetClick (e, bandwidthoffset) {
    bandwidthoffset = parseFloat(bandwidthoffset)
    const demodulationDefault = demodulationDefaults[demodulation].type
    let [l, m, r] = audio.getAudioRange().map(FFTOffsetToFrequency)
    if (demodulationDefault === 'USB') {
      r = Math.max(m, Math.min(m + getMaximumBandwidth(), r + bandwidthoffset))
    } else if (demodulationDefault === 'LSB') {
      l = Math.max(m - getMaximumBandwidth(), Math.min(m, l - bandwidthoffset))
    } else {
      r = Math.max(0, Math.min(m + getMaximumBandwidth() / 2, r + bandwidthoffset / 2))
      l = Math.max(m - getMaximumBandwidth() / 2, Math.min(m, l - bandwidthoffset / 2))
    }
    let audioParameters = [l, m, r].map(frequencyToFFTOffset)
    audioParameters = roundAudioOffsets(audioParameters)
    audio.setAudioRange(...audioParameters)
    updatePassband()
  }

  // Toggle buttons and slides for audio
  function handleMuteChange () {
    audio.setMute(mute)
  }
  function handleVolumeChange () {
    audio.setGain(Math.pow(10, (volume - 50) / 20))
  }
  function handleSquelchChange () {
    audio.setSquelch(squelchEnable)
  }
  function handleSquelchMove () {
    audio.setSquelchThreshold(squelch)
  }

  let NREnabled = false
  let NBEnabled = false
  let ANEnabled = false
  function handleNRChange () {
    audio.decoder.set_nr(NREnabled)
  }
  function handleNBChange () {
    audio.decoder.set_nb(NBEnabled)
  }
  function handleANChange () {
    audio.decoder.set_an(ANEnabled)
  }

  // Regular updating UI elements:
  // Other user tuning displays
  //
  let updateInterval
  let lastUpdated = 0
  function updateTick () {
    power = audio.getPowerDb()
    powerPeak = accumulator(power)

    if (events.getLastModified() > lastUpdated) {
      const myRange = audio.getAudioRange()
      const clients = events.getSignalClients()
      // Don't show our own tuning
      const myId = Object.keys(clients).find(k => (clients[k][1] - myRange[1]) < 1e-6)
      delete clients[myId]
      waterfall.setClients(clients)
      requestAnimationFrame(() => {
        waterfall.updateGraduation()
        waterfall.drawClients()
      })
      lastUpdated = events.getLastModified()
    }
  }

  // Tune to the frequency when clicked
  let frequencyMarkerComponent
  function handleFrequencyMarkerClick (event) {
    handleFrequencyChange({ detail: event.detail.frequency })
    demodulation = event.detail.modulation
    handleDemodulationChange()
  }

  // Permalink handling
  function updateLink () {
    const linkObj = {
      frequency: frequencyInputComponent.getFrequency().toFixed(0),
      modulation: demodulation
    }
    const linkQuery = constructLink(linkObj)
    link = `${location.origin}${location.pathname}?${linkQuery}`
    storeInLocalStorage(linkObj)
  }
  function handleLinkCopyClick () {
    copy(link)
  }
  
  // Decoder settings
  let logger
  let signalDecoder = 'none'
  const decoders = ['none']//, 'rds', 'ft8']
  async function handleDecoderChange (e, changed) {
    /*if (audio.getSignalDecoder()) {
      audio.getSignalDecoder().stop()
      audio.setSignalDecoder(null)
    }
    if (signalDecoder !== 'none') {
      const decoder = new Decoder(signalDecoder, audio.trueAudioSps, (text) => {
        if (logger) {
          logger.addLine(text)
        }
      })
      // Wait for the decode to initialize before running
      await decoder.promise()
      audio.setSignalDecoder(decoder)
    }*/
  }

  const backendPromise = init()
  onMount(async () => {
    // Disable all the input to prevent clicking
    [...document.getElementsByTagName('button'), ...document.getElementsByTagName('input')].forEach(element => {
      element.disabled = true
    })
    waterfall.initCanvas({
      canvasElem: waterfallCanvas,
      spectrumCanvasElem: spectrumCanvas,
      graduationCanvasElem: graduationCanvas
    })
  
    await backendPromise;

    // Enable after connection established
    [...document.getElementsByTagName('button'), ...document.getElementsByTagName('input')].forEach(element => {
      element.disabled = false
    })

    // Enable WBFM option if bandwidth is wide enough
    if (audio.trueAudioSps > 170000) {
      demodulators.push('WBFM')
      demodulators = demodulators
      bandwithoffsets.unshift('-100000')
      bandwithoffsets.push('+100000')
      bandwithoffsets = bandwithoffsets
    }

    frequencyInputComponent.setFrequency(FFTOffsetToFrequency(audio.getAudioRange()[1]))
    demodulation = audio.settings.defaults.modulation
  
    const updateParameters = (linkParameters) => {
      frequencyInputComponent.setFrequency(linkParameters.frequency)
      if (frequencyInputComponent.getFrequency() === linkParameters.frequency) {
        handleFrequencyChange({ detail: linkParameters.frequency })
      }
      if (demodulators.indexOf(linkParameters.modulation) !== -1) {
        demodulation = linkParameters.modulation
        handleDemodulationChange({}, true)
      }
      frequencyMarkerComponent.updateFrequencyMarkerPositions()
    }

    /* const storageParameters = loadFromLocalStorage()
    updateParameters(storageParameters) */
    const linkParameters = parseLink(location.search.slice(1))
    updateParameters(linkParameters)

    // Refresh all the controls to the initial value
    updatePassband()
    passbandTunerComponent.updatePassbandLimits()
    handleWaterfallColormapSelect()
    handleDemodulationChange({}, true)
    handleSpectrumChange()
    updateLink()

    updateInterval = setInterval(updateTick, 200)

    // For debugging
    window['spectrumAudio'] = audio
    window['spectrumWaterfall'] = waterfall
  })

  onDestroy(() => {
    // Stop everything
    clearInterval(updateInterval)
    audio.stop()
    waterfall.stop()
  })

  // Mobile gestures
  // Pinch = Mousewheel = Zoom
  let pinchX = 0
  function handleWaterfallPinchStart (e) {
    pinchX = 0
  }
  function handleWaterfallPinchMove (e) {
    const diff = e.detail.scale - pinchX
    pinchX = e.detail.scale
    const scale = 1 - (Math.abs(e.detail.srcEvent.movementX) / waterfallCanvas.getBoundingClientRect().width)
    const evt = e.detail.srcEvent
    evt.coords = { x: e.detail.center.x }
    evt.deltaY = -Math.sign(diff)
    evt.scaleAmount = scale
    waterfall.canvasWheel(evt)
    updatePassband()
  }
  // Pan = Mousewheel = waterfall dragging
  function handleWaterfallPanMove (e) {
    if (e.detail.srcEvent.pointerType === 'touch') {
      waterfall.mouseMove(e.detail.srcEvent)
      updatePassband()
    }
  }
</script>

<svelte:window
  on:mousemove={handleWindowMouseMove}
  on:mouseup={handleWindowMouseUp}
  />

<main>
  <div class="h-screen overflow-hidden flex flex-col-reverse sm:flex-row">
    <div class="w-full h-full sm:w-1/2 md:w-2/3 lg:w-3/4 sm:transition-all sm:ease-linear sm:duration-100 cursor-crosshair overflow-hidden">
      <FrequencyInput bind:this={frequencyInputComponent} on:change={handleFrequencyChange}></FrequencyInput>
      <canvas class="w-full bg-black peer {spectrumDisplay ? 'max-h-full' : 'max-h-0'}" bind:this={spectrumCanvas}
        on:wheel={handleWaterfallWheel}
        on:click={passbandTunerComponent.handlePassbandClick}
      width="1024" height="128"></canvas>
      <PassbandTuner
        on:change={handlePassbandChange}
        on:wheel={handleWaterfallWheel}
        bind:this={passbandTunerComponent}></PassbandTuner>
      <FrequencyMarkers bind:this={frequencyMarkerComponent}
        on:click={passbandTunerComponent.handlePassbandClick}
        on:wheel={handleWaterfallWheel}
        on:markerclick={handleFrequencyMarkerClick}></FrequencyMarkers>
      <canvas class="w-full bg-black peer" bind:this={graduationCanvas}
        on:wheel={handleWaterfallWheel}
        on:click={passbandTunerComponent.handlePassbandClick}
      width="1024" height="20"></canvas>
      <div class="w-full peer overflow-hidden"><canvas class="w-full bg-black {waterfallDisplay ? 'block' : 'hidden'}" bind:this={waterfallCanvas}
        use:pinch
        on:pinchstart={handleWaterfallPinchStart}
        on:pinchmove={handleWaterfallPinchMove}
        use:pan
        on:panmove={handleWaterfallPanMove}
        on:wheel={handleWaterfallWheel}
        on:mousedown={handleWaterfallMouseDown}
      width="1024" height="4096"></canvas></div>
      <!--<div class="fixed border border-black text-xs px-1 hidden 
      transition-opacity duration-100 bg-blue-800 text-gray-400
        peer-hover:block {frequencyHintActive ? 'opacity-1' : 'opacity-0'}"
          style="left: {frequencyHintLeft}px; top: {frequencyHintTop}px;">
        {frequencyHint}
      </div>-->
      <div class="{signalDecoder === 'none' ? 'hidden' : 'block'}">
        <Logger bind:this={logger} capacity={1000}></Logger>
      </div>
    </div>
    <div class="w-full h-screen overflow-y-scroll sm:w-1/2 md:w-1/3 lg:w-1/4 sm:transition-all sm:ease-linear sm:duration-100">
      <div class="tab">
        <div class="m-2">
        </div>
      </div>
      <div class="tab">
        <div class="bg-gray-500 text-left pl-2">
          <label for="tab-multi-one">Audio</label>
        </div>
        <div class="m-2">
          <div class="grid grid-cols-4">
              {#each demodulators as demodulator (demodulator)}
              <label>
                <input type="radio" bind:group={demodulation}
                  on:click={(e) => handleDemodulationChange(e, false)}
                  on:change={(e) => handleDemodulationChange(e, true)}  class="hidden peer" name="demodulation" value={demodulator}
                    autocomplete="off">
                <div class="basic-button m-1"> <!--type="button"-->
                    {demodulator} 
                </div>
              </label>
              {/each}
          </div>
          <p class="text-white text-sm">Bandwidth: {bandwidth}kHz</p>
          <div class="flex items-center justify-center pb-1 scale-90 sm:scale-75 md:scale-[0.70]">
            {#each bandwithoffsets as bandwidthoffset (bandwidthoffset)}
              <button class="click-button w-1/4" on:click={(e) => handleBandwidthOffsetClick(e, bandwidthoffset)}
                  data-expand="{bandwidthoffset}">{bandwidthoffset}</button>
            {/each}
          </div>
          <div>
            <div class="flex">
              <label class="w-1/6 text-white">
                <input type="checkbox" class="hidden peer" autocomplete="off" bind:checked={mute} on:change={handleMuteChange}>
                <div class="basic-button peer-checked:hidden">
                  🔊
                </div>
                <div class="basic-button hidden peer-checked:block">
                  🔇
                </div>
              </label>
              <div class="w-1/6 text-white text-xs text-center m-auto">{volume}%</div>
              <div class="px-0 w-2/3 align-middle">
                <input type="range" bind:value={volume} on:mousemove={handleVolumeChange} disabled={mute} min="0" max="100" step="0.1" class="disabled: cursor-not-allowed w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none">
              </div>
            </div>
            <div class="flex">
              <label class="w-1/6 text-white">
                <input type="checkbox" class="hidden peer" autocomplete="off" bind:checked={squelchEnable} on:change={handleSquelchChange}>
                <div class="basic-button line-through thick-line-through peer-checked:no-underline">
                  &nbsp;Sq&nbsp;
                </div>
                <Tooltip text="Squelch"></Tooltip>
              </label>
              <span class="w-1/6 text-white text-xs text-center m-auto">{squelch}db</span>
              <div class="px-0 w-2/3 align-middle">
                <input type="range" bind:value={squelch} on:mousemove={handleSquelchMove} min="-100" max="0" step="0.1" class="w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none slider-thumb">
              </div>
            </div>
            <div class="flex">
              <span class="w-1/6 text-white text-xs text-center relative basic-button">
                <span
                  class="bg-green-800 w-full absolute left-0 top-0 z-10 transition-all"
                  style="top: {-power}%; height: {power + 100}%"
                ></span>
                <span
                  class="bg-red-800 w-full absolute left-0 top-0 z-0 transition-all"
                  style="top: {-powerPeak}%; height: {powerPeak + 100}%"
                ></span>
                <span class="relative z-20">Pwr</span>
              </span>
              <span class="w-1/6 text-white text-xs text-center m-auto">{power.toFixed(1)}db</span>
              <div class="px-0 w-2/3 align-middle flex">
                <div class="bg-gray-300 h-1 w-full m-auto rounded-full relative">
                  <span
                    class="bg-green-500 h-1 absolute left-0 top-0 rounded-full z-10 transition-all"
                    style="width: {power + 100}%"
                  ></span>
                  <span
                    class="bg-red-500 h-1 absolute left-0 top-0 rounded-full z-0 transition-all"
                    style="width: {powerPeak + 100}%"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="grid grid-cols-4 my-1">
              <LineThroughButton name="NR" on:change={handleNRChange} bind:checked={NREnabled}>
                <Tooltip text="Noise Reduction"></Tooltip>
              </LineThroughButton>
              <LineThroughButton name="NB" on:change={handleNBChange} bind:checked={NBEnabled}>
                <Tooltip text="Noise Blanker"></Tooltip>
              </LineThroughButton>
              <LineThroughButton name="AN" on:change={handleANChange} bind:checked={ANEnabled}>
                <Tooltip text="Autonotch"></Tooltip>
              </LineThroughButton>
            </div>
          </div>
        </div>
      </div>
      <div class="tab">
        <div class="bg-gray-500 text-left pl-2">
          <label for="tab-multi-one">Waterfall</label>
        </div>
        <div class="m-2">
          <div class="flex flex-wrap items-center content-center justify-center my-1">
            <CheckButton name="Spectrum Analyzer" bind:checked={spectrumDisplay} on:change={handleSpectrumChange}></CheckButton>
            <CheckButton name="Waterfall" bind:checked={waterfallDisplay} on:change={handleWaterfallChange}></CheckButton>
          </div>
          <div class="flex flex-wrap items-center justify-center w-full" aria-label="Bandwidth controls">
              <button class="click-button w-1/4" on:click={(e) => handleWaterfallMagnify(e, 'max')}>🔎max</button>
              <button class="click-button w-1/4" on:click={(e) => handleWaterfallMagnify(e, '+')}>🔎+</button>
              <button class="click-button w-1/4" on:click={(e) => handleWaterfallMagnify(e, '-')}>🔎-</button>
              <button class="click-button w-1/4" on:click={(e) => handleWaterfallMagnify(e, 'min')}>🔎min</button>
          </div>
          <div class="{spectrumDisplay ? 'flex' : 'hidden'}">
            <div class="w-1/6 text-white text-xs align-middle p-auto m-auto">
              Smoothing
            </div>
            <span class="w-1/6 text-white text-xs text-center m-auto">{alpha}</span>
            <div class="px-0 w-2/3 align-middle">
              <input type="range" bind:value={alpha} on:mousemove={handleAlphaMove} min="0" max="1" step="0.01" class="w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none slider-thumb">
            </div>
          </div>
          <div class="{waterfallDisplay ? 'flex' : 'hidden'}">
            <div class="w-1/6 text-white text-xs align-middle p-auto m-auto">
              Brightness
            </div>
            <span class="w-1/6 text-white text-xs text-center m-auto">{brightness}</span>
            <div class="px-0 w-2/3 align-middle">
              <input type="range" bind:value={brightness} on:mousemove={handleBrightnessMove} min="0" max="255" step="1" class="w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none slider-thumb">
            </div>
          </div>
          <div class="{waterfallDisplay ? 'flex' : 'hidden'} pt-1">
            <div class="w-1/6 text-white text-xs text-center m-auto">Colormap: </div>
            <div class="w-1/3 flex items-center align-middle m-auto px-2">
              <canvas class="w-full h-4" width="256" bind:this={colormapPreview}></canvas>
            </div>
            <div class="px-0 w-1/2 h-full flex align-middle bg-transparent z-50">
              <!--<Select on:select={handleWaterfallColormapSelect} items={availableColormaps} />-->
              <select class="h-full w-full py-px bg-transparent text-white text-xs border border-1 border-blue-500"
                bind:value={currentColormap} on:change="{handleWaterfallColormapSelect}">
                {#each availableColormaps as colormap}
                  <option class="m-auto p-auto text-xs bg-black" value={colormap}>
                    {colormap}
                  </option>
                {/each}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="tab">
        <div class="bg-gray-500 text-left pl-2">
          <label for="tab-multi-one">Bookmarks</label>
        </div>
        <div class="m-2">
          <div class="flex">
            <div class="border border-blue-500 text-blue-500 transition-all duration-100 text-center text-xs px-2 py-1 active:bg-blue-600 active:text-white">
              <button on:click={handleLinkCopyClick}>📋 Link:</button>
              <Popover text="Copied!"></Popover>
            </div>
            <input type="text" class="flex-grow bg-transparent text-white border border-l-0 border-blue-500 text-xs px-2" value={link} readonly/>
          </div>
        </div>
      </div>
      <div class="tab">
        <div class="bg-gray-500 text-left pl-2">
          <label for="tab-multi-one">Decoders</label>
        </div>
        <div class="m-2">
          <div class="grid grid-cols-4">
              {#each decoders as decoder (decoder)}
              <label>
                <input type="radio" bind:group={signalDecoder}
                  on:change={(e) => handleDecoderChange(e, true)}  class="hidden peer" name="decoder" value={decoder}
                    autocomplete="off">
                <div class="basic-button m-1"> <!--type="button"-->
                    {decoder} 
                </div>
              </label>
              {/each}
          </div>
    </div>
  </div>
</main>

<style global lang="postcss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

	:global(body.light-mode) {
		background-color: #A9A9A9;
		transition: background-color 0.3s
	}
	:global(body) {
		background-color: #464646;
	}

  main {
    text-align: center;
    margin: 0 auto;
  }
  .thick-line-through {
    text-decoration-thickness: 2px;
  }
  
  .basic-button {
    @apply text-blue-500 border border-blue-500 font-bold uppercase transition-all duration-100 text-center text-xs px-2 py-1
            peer-checked:bg-blue-600 peer-checked:text-white;
  }
  .basic-button:hover {
    @apply border-blue-400 text-white;
  }

  .click-button {
    @apply text-blue-500 border border-blue-500 font-bold uppercase transition-all duration-100 text-center text-xs px-2 py-1;
  }
  .click-button:active {
    @apply bg-blue-600 text-white;
  }

</style>