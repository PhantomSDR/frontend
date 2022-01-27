<script>
    import isNumber from 'is-number'
    import { createEventDispatcher } from 'svelte'
    import { audio } from './backend'
    const dispatch = createEventDispatcher()

    let frequency = 0
    const frequencyUnit = 'MHz'
    let frequencyDecimals
    let frequencyDisplay

    let frequencyLow = 0
    let frequencyHigh = 0
    const frequencyUnitMappings = {
      Hz: 0,
      kHz: 3,
      MHz: 6,
      GHz: 9
    }

    function handleFrequencyChange (e) {
      if (!isNumber(frequencyDisplay)) {
        updateDisplay()
        return
      }
      let enteredFrequency = parseFloat(frequencyDisplay)
      enteredFrequency *= Math.pow(10, frequencyDecimals)
    
      if (checkFrequency(enteredFrequency)) {
        frequency = enteredFrequency
        dispatch('change', enteredFrequency)
      }
      updateDisplay()
    }
    
    function updateDisplay (f) {
      frequencyDisplay = (frequency / Math.pow(10, frequencyDecimals)).toFixed(frequencyDecimals)
    }

    $: frequencyDecimals = frequencyUnitMappings[frequencyUnit]
    $: updateDisplay(frequency)

    function checkFrequency (f) {
      const lo = audio.baseFreq
      const hi = lo + audio.totalBandwidth
      return f >= lo && f < hi
    }
    export function setFrequency (f) {
      if (checkFrequency(f)) {
        frequency = f
      }
    }

    export function getFrequency () {
      return frequency
    }

    export function updateFrequencyLimits (lo, hi) {
      frequencyLow = lo
      frequencyHigh = hi
    }
    updateDisplay()
</script>

<style>
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }

    input[type=number] {
        -moz-appearance:textfield;
    }
</style>

<div class="w-full md-2 items-center bg-black">
    <input type="number" class="text-2xl font-mono text-white bg-transparent text-center appearance-none" bind:value={frequencyDisplay} on:change={handleFrequencyChange}/>
    <span class="text-white m-2 text-2xl">{frequencyUnit}</span>
</div>

