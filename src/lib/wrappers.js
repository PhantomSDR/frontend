import * as fzstd from 'fzstd'
import { Audio, AudioCodec, ZstdStreamDecoder, firdes_kaiser_lowpass, __wbg_set_wasm } from '../modules/phantomsdrdsp_bg.js'

// https://stackoverflow.com/questions/47879864/how-can-i-check-if-a-browser-supports-webassembly
const hasWasm = (() => {
  try {
    if (typeof WebAssembly === 'object' &&
      typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00))
      if (module instanceof WebAssembly.Module) { return new WebAssembly.Instance(module) instanceof WebAssembly.Instance }
    }
  } catch (e) {
  }
  return false
})()

if (!window.crypto) {
  window.crypto = window.msCrypto
}

export function createDecoder(audioCodec, codecRate, inputRate, outputRate) {
  switch (audioCodec) {
    case 'flac':
      return new Audio(AudioCodec.Flac, codecRate, inputRate, outputRate)
    case 'opus':
      return new Audio(AudioCodec.Opus, codecRate, inputRate, outputRate)
  }
}

export { firdes_kaiser_lowpass }

/*window.Atomics = window.Atomics || {
  add (typedArray, index, value) {
    const val = typedArray[index]
    typedArray[index] += value
    return val
  },
  and (typedArray, index, value) {
    const val = typedArray[index]
    typedArray[index] &= value
    return val
  },
  exchange (typedArray, index, value) {
    const val = typedArray[index]
    typedArray[index] = value
    return val
  },
  load (typedArray, index) {
    return typedArray[index]
  },
  or (typedArray, index, value) {
    const val = typedArray[index]
    typedArray[index] |= value
    return val
  },
  store (typedArray, index, value) {
    typedArray[index] = value
    return value
  },
  sub (typedArray, index, value) {
    const val = typedArray[index]
    typedArray[index] -= value
    return val
  },
  xor (typedArray, index, value) {
    const val = typedArray[index]
    typedArray[index] ^= value
    return val
  }
}*/


function decodePacket(packet) {
  let packetview = new DataView(packet.buffer);
  let l = packetview.getUint32(8, true);
  let r = packetview.getUint32(12, true);
  return [new Int8Array(packet.buffer, 16), l, r]
}

export class ZstdWaterfallDecoder {
  constructor() {
    this.decoder = new ZstdStreamDecoder()
  }
  decode(packet) {
    packet = new Uint8Array(packet)
    return this.decoder.decode(packet).map(decodePacket)
  }
  destroy() {
    this.decoder.free()
  }
}

export function createWaterfallDecoder(format) {
  switch (format) {
    case 'zstd':
      return new ZstdWaterfallDecoder()
    case 'av1':
      return new ZstdWaterfallDecoder()
  }
}

export default async function initWrappers() {
  let wasm;
  if (hasWasm) {
    wasm = await import("../modules/phantomsdrdsp_bg.wasm");
  } else {
    wasm = await import("../modules/phantomsdrdsp_bg_fallback.js");
  }
  __wbg_set_wasm(wasm);
  wasm.__wbindgen_start();
}
