<script>
  import isNumber from "is-number";
  import { createEventDispatcher } from "svelte";
  import { audio } from "./backend";
    import { pan } from "./hammeractions";
  const dispatch = createEventDispatcher();

  let frequency = 0;
  let frequencyBFO = 0;
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

  function changeFrequency(f) {
    frequency = f;
    dispatch("change", f + frequencyBFO);
  }

  function handleFrequencyChange(e) {
    if (!isNumber(frequencyDisplay)) {
      updateDisplay();
      return;
    }
    let enteredFrequency = parseFloat(frequencyDisplay);
    enteredFrequency *= Math.pow(10, frequencyDecimals);

    if (checkFrequency(enteredFrequency)) {
      changeFrequency(enteredFrequency);
    }
    updateDisplay();
  }

  function handleFrequencyClick(e) {
    // frequencyTextboxInput.hidden = false;
    // frequencyScrollInput.hidden = true;
  }

  function handleFrequencyMousewheel(e, multiplier) {
    let delta = e.deltaY > 0 ? -1 : 1;
    // update the value in the html
    let updatedFrequency = frequency + delta * multiplier;

    // If it the kHz position, zero out the Hz position
    if (multiplier === 1000) {
      updatedFrequency -= (updatedFrequency % 1000);
    }
    
    if (checkFrequency(updatedFrequency)) {
      changeFrequency(updatedFrequency);
    }
  }

  function handleFrequencyDigitKeyPress(e, multiplier) {
    e.preventDefault()
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

      // Focus the next element
      let nextIndex = frequencyDigits.findIndex((d) => d.multiplier === multiplier) + 1;
      if (nextIndex < frequencyDigits.length) {
        frequencyDigits[nextIndex].element.focus();
      } else {
        e.target.blur();
      }

      // If it the kHz position, zero out the Hz position
      if (multiplier === 1000) {
        updatedFrequency -= (updatedFrequency % 1000);
      }
    }

    if (checkFrequency(updatedFrequency)) {
      changeFrequency(updatedFrequency);
    }
  }

  let digitCumulativePan = 0;
  let digitLastDeltaY = 0;
  function handleFrequencyDigitPanStart(e, multiplier) {
    e.target.classList.add("bg-gray-800");
    digitCumulativePan = 0;
    digitLastDeltaY = e.detail.deltaY;
  }
  function handleFrequencyDigitPanMove(e, multiplier) {
    const digitElementHeight = e.target.getBoundingClientRect().height;
    const difference = e.detail.deltaY - digitLastDeltaY;
    digitLastDeltaY = e.detail.deltaY;
    //alert(difference + ' ' + digitElementHeight);
    digitCumulativePan -= difference;
    if (digitCumulativePan > digitElementHeight) {
      let updatedFrequency = frequency + multiplier;
      if (checkFrequency(updatedFrequency)) {
        changeFrequency(updatedFrequency);
      }
      digitCumulativePan -= digitElementHeight;
    } else if (-digitCumulativePan > digitElementHeight) {
      let updatedFrequency = frequency - multiplier;
      if (checkFrequency(updatedFrequency)) {
        changeFrequency(updatedFrequency);
      }
      digitCumulativePan += digitElementHeight;
    }
  }
  function handleFrequencyDigitPanEnd(e, multiplier) {
    e.target.classList.remove("bg-gray-800");
  }

  function updateDisplay(f) {
    frequencyDisplay = (frequency / Math.pow(10, frequencyDecimals)).toFixed(
      frequencyDecimals,
    );

    if (frequencyTextboxInput) {
      // frequencyTextboxInput.hidden = true;
      // frequencyScrollInput.hidden = false;
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
  
  export function setBFO(f) {
    frequencyBFO = f;
  }

  export function getBFO() {
    return frequencyBFO;
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
  <div class="m-0 p-0" hidden bind:this={frequencyTextboxInput}>
    <input
      type="number"
      class="text-3xl font-mono text-white outline-none bg-transparent text-center appearance-none p-0 m-0 inline-block"
      bind:value={frequencyDisplay}
      on:change={handleFrequencyChange}
    />
    <span class="text-white font-mono p-1 m-1 text-3xl">{frequencyUnit}</span>
  </div>
  <div class="font-mono m-0 p-0" style="font-size: 0"
    bind:this={frequencyScrollInput}
    >
    {#each frequencyDigits as { element, multiplier, separator, value }, i}
      <input type="number"
        class="text-white text-3xl text-center whitespace-pre px-1 m-0 outline-none bg-transparent caret-transparent cursor-crosshair focus:bg-gray-800"
        style="width: 1em"
        bind:this={element}
        tabindex="-1"
        on:wheel={(e) => handleFrequencyMousewheel(e, multiplier)}
        on:keydown={(e) => handleFrequencyDigitKeyPress(e, multiplier)}
        on:mouseenter={() => element.focus()}
        use:pan
        on:panstart={(e) => handleFrequencyDigitPanStart(e, multiplier)}
        on:panmove={(e) => handleFrequencyDigitPanMove(e, multiplier)}
        on:panend={(e) => handleFrequencyDigitPanEnd(e, multiplier)}
        data-multiplier={multiplier}
        value={value}
        max="9"
        min="0"
        />
      {#if separator}
        <span class="text-white text-xl p-0 m-0">.</span>
      {/if}
    {/each}
    <span class="text-white text-3xl px-1 mx-1">Hz</span>
  </div>
  <div class="transform -translate-y-full m-0 p-0">
    {#if frequencyBFO}
      <span class="absolute transform -translate-y-full font-mono m-0 p-1 text-white text-sm left-3/4">BFO: {Math.abs(frequencyBFO)}Hz</span>
    {/if}
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
