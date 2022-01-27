export default class SpectrumEvent {
  constructor (endpoint) {
    this.endpoint = endpoint
    this.signalClients = {}
    this.lastModified = performance.now()
  }

  init () {
    if (this.promise) {
      return this.promise
    }

    this.eventSocket = new WebSocket(this.endpoint)
    this.eventSocket.binaryType = 'arraybuffer'
    this.eventSocket.onmessage = this.socketMessage.bind(this)

    this.promise = new Promise((resolve, reject) => {
      this.eventSocket.onopen = resolve
      this.resolvePromise = resolve
      this.rejectPromise = reject
    })

    return this.promise
  }

  socketMessage (event) {
    const data = JSON.parse(event.data)
    this.data = data
    if ('signal_list' in data) {
      this.signalClients = data.signal_list
    }
    if ('signal_changes' in data) {
      const signalChanges = data.signal_changes
      for (const [user, range] of Object.entries(signalChanges)) {
        if (range[0] === -1 && range[1] === -1) {
          delete this.signalClients[user]
        } else {
          this.signalClients[user] = range
        }
      }
    }
    this.lastModified = performance.now()
  }

  setUserID (userID) {
    this.eventSocket.send(JSON.stringify({
      cmd: 'userid',
      userid: userID
    }))
  }

  getSignalClients () {
    return this.signalClients
  }

  getLastModified () {
    return this.lastModified
  }
}
