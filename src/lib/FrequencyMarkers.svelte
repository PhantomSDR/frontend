<script>
    import { createEventDispatcher } from 'svelte'
    import bounds from 'binary-search-bounds'

    import { frequencyToWaterfallOffset, getFrequencyView } from '../lib/backend'

    import builtinShortwave from '../assets/shortwavestations.json'
    import builtinAmateur from '../assets/amateurfrequencies.json'
    const dispatch = createEventDispatcher()
    
    const frequencyList = []
    function insertAll (frequencies) {
      for (const frequency of frequencies) {
        frequencyList.push([
          frequency.f || frequency.frequency,
          frequency.d || frequency.description,
          frequency.m || frequency.modulation
        ])
      }
    }
    function frequencyListComparator (a, b) {
      return a[0] - b[0]
    }
    function finalizeList () {
      frequencyList.sort(frequencyListComparator)
    }
    
    //insertAll(builtinShortwave)
    //insertAll(builtinAmateur)
    finalizeList()

    function getFrequencyBoundsInRange (lo, hi) {
      return [bounds.ge(frequencyList, [lo], frequencyListComparator), bounds.ge(frequencyList, [hi], frequencyListComparator)]
    }
    function getFrequencyInRange (from, to) {
      return frequencyList.slice(from, to).map(x => ({
        frequency: x[0],
        description: x[1],
        modulation: x[2],
        left: 0
      }))
    }
    
    let frequencyMarkers = []
    let frequencyBoundsLo = -1
    let frequencyBoundsHi = -1
    export function updateFrequencyMarkerPositions () {
      const [frequencyFrom, frequencyTo] = getFrequencyView()
      const [from, to] = getFrequencyBoundsInRange(frequencyFrom, frequencyTo)
      if (frequencyTo - frequencyFrom <= 200000) {
        if (from !== frequencyBoundsLo || to !== frequencyBoundsHi) {
          frequencyBoundsLo = from
          frequencyBoundsHi = to
          frequencyMarkers = getFrequencyInRange(frequencyBoundsLo, frequencyBoundsHi)
        }
      } else {
        frequencyMarkers = []
      }
      for (let i = 0; i < frequencyMarkers.length; i++) {
        frequencyMarkers[i].left = frequencyToWaterfallOffset(frequencyMarkers[i].frequency)
      }
    }
</script>
<div on:click|self on:wheel|self class="w-full h-4 bg-black relative">
    {#each frequencyMarkers as frequencyMarker (frequencyMarker.frequency)}
    <div class="h-4 absolute p-0 group" style="left: {frequencyMarker.left * 100}%"
        on:click={() => dispatch('markerclick', frequencyMarker)}>
        <div class="top-0 w-px h-8 z-0 peer bg-yellow-600 absolute">
        </div>
        <div class="outline-1 outline-black outline-offset-0 outline p-px
            bg-yellow-400 absolute bottom-0 z-10 group-hover:z-20 hover:z-20 peer-hover:z-20
            text-left whitespace-pre whitespace-nowrap text-black text-xs align-middle
            border border-yellow-600 transform origin-bottom-left overflow-hidden
            h-auto max-h-full hover:max-h-screen peer-hover:max-h-screen
            transition-all ease-linear duration-1000">
        {frequencyMarker.description}</div>
    </div>
    {/each}
</div>