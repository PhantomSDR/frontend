<script>
    import { createEventDispatcher, onMount } from 'svelte'
    import { bandwidthToWaterfallOffset, getMaximumBandwidth } from './backend'

    const dispatch = createEventDispatcher()
    const NoDrag = 0
    const All = 1
    const Left = 2
    const Right = 3
    const Click = 4

    let draggingState = NoDrag
    let draggingOffset
    let draggingTotal

    let passbandWidth
    let passbandParent

    let passbandOffset = -1000
    let passbandLeftOffset
    let passbandRightOffset

    let maximumSideband
    let maximumSidebandOffset
    $: maximumSidebandOffset = Math.floor(maximumSideband * passbandWidth) / 2

    let cssPassbandOffset
    let cssPassband

    function handleMoveStart (e, state) {
      draggingState = state
      draggingTotal = 0
      if (draggingState === All) {
        draggingOffset = e.clientX - passbandOffset * passbandWidth
      } else if (draggingState === Left) {
        draggingOffset = e.clientX - (passbandOffset + passbandLeftOffset) * passbandWidth
      } else if (draggingState === Right) {
        draggingOffset = e.clientX - (passbandOffset + passbandRightOffset) * passbandWidth
      }
    }
    function handleMove (e) {
      if (draggingState === Click) {
        draggingTotal += e.movementX
      } else if (draggingState !== NoDrag) {
        const zero = passbandParent.getBoundingClientRect().x
        const offsetX = e.clientX - zero - draggingOffset
        if (draggingState === All) {
          passbandOffset = Math.min(Math.max(-passbandLeftOffset * passbandWidth, offsetX), passbandWidth - passbandRightOffset * passbandWidth) / passbandWidth
        } else if (draggingState === Left) {
          passbandLeftOffset = Math.min(Math.max(-maximumSidebandOffset, offsetX - passbandOffset * passbandWidth), passbandRightOffset * passbandWidth) / passbandWidth
        } else if (draggingState === Right) {
          passbandRightOffset = Math.min(Math.max(passbandLeftOffset * passbandWidth, offsetX - passbandOffset * passbandWidth), maximumSidebandOffset) / passbandWidth
        }
        dispatchPassbandChange()
      }
    }
    function handleMoveEnd (e) {
      if (draggingState === Click && draggingTotal < 5) {
        handlePassbandClick(e)
      }
      draggingState = NoDrag
      passbandOffset = passbandOffset
    }
    export function handlePassbandClick (e) {
      const zero = passbandParent.getBoundingClientRect().x
      const offsetX = e.clientX - zero
      passbandOffset = offsetX / passbandWidth
      dispatchPassbandChange()
    }

    export function getOffsetFromEvent (e) {
      const zero = passbandParent.getBoundingClientRect().x
      const offsetX = e.clientX - zero
      return offsetX / passbandWidth
    }
    $: cssPassbandOffset = `transform: translate3d(${passbandOffset * passbandWidth - 0.5}px, 0, 0)`
    $: cssPassband = `transform: translate3d(${passbandLeftOffset * passbandWidth + 0.5}px, 0, 0); width: ${(passbandRightOffset - passbandLeftOffset) * passbandWidth}px`

    let dispatchTime = 0
    function dispatchPassbandChange () {
      const message = [(passbandOffset + passbandLeftOffset), passbandOffset, (passbandOffset + passbandRightOffset)]
      const currentTime = Date.now()
      if (currentTime - dispatchTime > 50) {
        dispatch('change', message)
        dispatchTime = currentTime
      }
    }
    export function changePassband (offsets) {
      const [l, m, r] = offsets
      passbandOffset = m
      passbandLeftOffset = l - m
      passbandRightOffset = r - m
    }

    export function updatePassbandLimits () {
      maximumSideband = bandwidthToWaterfallOffset(getMaximumBandwidth())
    }

    onMount(() => {
    })
</script>

<svelte:window on:mouseup={handleMoveEnd} on:mousemove={handleMove}/>

<div class="w-full h-5 bg-black" on:wheel bind:this={passbandParent} bind:clientWidth={passbandWidth} on:mousedown|self={(e) => handleMoveStart(e, Click)}>
    <div class="h-full w-px bg-yellow-500" style={cssPassbandOffset}>
        <div class="h-full absolute cursor-ew-resize z-10" on:mousedown|self={(e) => handleMoveStart(e, All)} style={cssPassband}>
            <svg class="h-5 w-2 inline absolute group cursor-w-resize z-0" on:mousedown={(e) => handleMoveStart(e, Left)} style="right: 100%">
                <line x1="100%" y1="20%" x2="20%" y2="100%" class="stroke-current text-yellow-500 stroke-1 group-hover:stroke-2"></line>
                <line x1="0%" y1="100%" x2="20%" y2="100%" class="stroke-current text-yellow-500 stroke-1 group-hover:stroke-2"></line>
            </svg>
            <div class="w-full h-px bg-yellow-500 align-middle absolute z-10" style="top: 20%"></div>
            <svg class="h-5 w-2 inline absolute group cursor-e-resize z-0" style="left: 100%" on:mousedown={(e) => handleMoveStart(e, Right)} >
                <line x1="0%" y1="20%" x2="80%" y2="100%" class="stroke-current text-yellow-500 stroke-1 group-hover:stroke-2"></line>
                <line x1="80%" y1="100%" x2="100%" y2="100%" class="stroke-current text-yellow-500 stroke-1 group-hover:stroke-2"/>
            </svg>
        </div>
        <div class="h-full w-1 bg-transparent mx-auto cursor-ew-resize z-10" on:mousedown|self={(e) => handleMoveStart(e, All)}>
        </div>
    </div>
</div>