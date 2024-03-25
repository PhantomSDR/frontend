<script>
  import isNumber from "is-number";
  import { createEventDispatcher } from "svelte";
  import { audio } from "./backend";
  const dispatch = createEventDispatcher();

  let frequency = 0;
  const frequencyUnit = "MHz";
  let frequencyDecimals;
  let frequencyDisplay;
  let frequencyTextboxInput;
  let frequencyScrollInput;

  let frequencyLow = 0;
  let frequencyHigh = 0;
  const frequencyUnitMappings = {
    Hz: 0,
    kHz: 3,
    MHz: 6,
    GHz: 9,
  };
  const frequencyUnitLetterMappings = {
    3: "k",
    6: "M",
    9: "G",
  };
  let frequencyDigits = [];

  function handleFrequencyChange(e) {
    if (!isNumber(frequencyDisplay)) {
      updateDisplay();
      return;
    }
    let enteredFrequency = parseFloat(frequencyDisplay);
    enteredFrequency *= Math.pow(10, frequencyDecimals);

    if (checkFrequency(enteredFrequency)) {
      frequency = enteredFrequency;
      dispatch("change", enteredFrequency);
    }
    updateDisplay();
  }

  function handleFrequencyDoubleclick(e) {
    frequencyTextboxInput.classList.remove("hidden");
    frequencyScrollInput.hidden = true;
  }

  function handleFrequencyMousewheel(e, multiplier) {
    let delta = e.deltaY > 0 ? -1 : 1;
    // update the value in the html
    let updatedFrequency = frequency + delta * multiplier;

    if (checkFrequency(updatedFrequency)) {
      frequency = updatedFrequency;
      dispatch("change", updatedFrequency);
    }
  }

  function handleFrequencyDigitKeyPress(e, multiplier) {
    let key = e.key
    let updatedFrequency = frequency;
    if (key === "ArrowUp") {
      updatedFrequency = frequency + multiplier;
    } else if (key === "ArrowDown") {
      updatedFrequency = frequency - multiplier;
    } else if (key >= "0" && key <= "9") {
      let digit = parseInt(key);
      let currentDigit = Math.floor(frequency / multiplier) % 10;
      updatedFrequency += (digit - currentDigit) * multiplier;
    }

    if (checkFrequency(updatedFrequency)) {
      frequency = updatedFrequency;
      dispatch("change", updatedFrequency);
    }
  }


  function updateDisplay(f) {
    frequencyDisplay = (frequency / Math.pow(10, frequencyDecimals)).toFixed(
      frequencyDecimals,
    );

    if (frequencyTextboxInput) {
      frequencyTextboxInput.classList.add("hidden");
      frequencyScrollInput.hidden = false;
    }

    let isLeadingZero = true;
    for (let i = 0; i < frequencyDigits.length; i++) {
      let digit = Math.floor(frequency / frequencyDigits[i].multiplier) % 10;
      if (digit !== 0) {
        isLeadingZero = false;
      }
      if (isLeadingZero && digit == 0) {
        frequencyDigits[i].value = " ";
      } else {
        frequencyDigits[i].value = digit;
      }
    }
    frequencyDigits = frequencyDigits;
    
  }

  $: frequencyDecimals = frequencyUnitMappings[frequencyUnit];
  $: updateDisplay(frequency);

  function checkFrequency(f) {
    const lo = audio.baseFreq;
    const hi = lo + audio.totalBandwidth;
    return f >= lo && f < hi;
  }
  export function setFrequency(f) {
    if (checkFrequency(f)) {
      frequency = f;
    }
  }

  export function getFrequency() {
    return frequency;
  }

  export function updateFrequencyLimits(lo, hi) {
    frequencyLow = lo;
    frequencyHigh = hi;

    let digits = Math.ceil(Math.log10(frequencyHigh + 1));
    for (let i = 0; i < digits; i++) {
      let digitMultiplier = digits - i - 1;
      frequencyDigits.push({
        element: null,
        multiplier: Math.pow(10, digits - i - 1),
        separator:
          digitMultiplier % 3 === 0
            ? frequencyUnitLetterMappings[digitMultiplier]
            : null,
        value: 0,
      });
    }
    frequencyDigits = frequencyDigits;
  }
  updateDisplay();
</script>

<div class="w-full md-2 items-center bg-black pt-1">
  <div class="hidden m-0 p-0" bind:this={frequencyTextboxInput}>
    <input
      type="number"
      class="text-3xl font-mono text-white outline-none bg-transparent text-center appearance-none p-0 m-0 inline-block"
      bind:value={frequencyDisplay}
      on:change={handleFrequencyChange}
    />
    <span class="text-white font-mono p-1 m-1 text-3xl">{frequencyUnit}</span>
  </div>
  <div class="font-mono" style="font-size: 0"
    bind:this={frequencyScrollInput}
    on:click={handleFrequencyDoubleclick}
    >
    {#each frequencyDigits as { element, multiplier, separator, value }, i}
      <span
        class="text-white text-3xl whitespace-pre p-1 m-0 outline-none hover:bg-gray-800"
        bind:this={element}
        tabindex="-1"
        on:wheel={(e) => handleFrequencyMousewheel(e, multiplier)}
        on:keydown={(e) => handleFrequencyDigitKeyPress(e, multiplier)}
        on:mouseenter={() => element.focus()}
        data-multiplier={multiplier}>{value}</span
      >
      {#if separator}
        <span class="text-white text-xl p-0 m-0">.</span>
      {/if}
    {/each}
    <span class="text-white text-3xl p-1 m-1">Hz</span>
  </div>
</div>

<style>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
