import EventDispenser from 'event-dispenser'

interface TickEvent {
  time: number
  timeFlags: number[]
  startTime: number
}

interface StatusChangeEvent {
  status: Status
  prevStatus: Status
}

interface EventMap {
  tick: TickEvent
  'status-change': StatusChangeEvent
}

type Result = {
  endTime: number
  isOvertime: boolean
} & TickEvent

type Status = 'stopped' | 'ticking' | 'paused'

export default class Stopwatch extends EventDispenser<EventMap> {
  private _interval = 64

  private _maxTime: number | undefined

  private _time = 0

  private _timeFlags: number[] = []

  private _startTime = 0

  private _restartTime = 0

  private _endTime = 0

  private _timeBase = 0

  private _status: Status = 'stopped'

  private _resolve: ((value: Result) => void) | undefined

  private _timeout: number | undefined

  constructor(
    options: {
      interval?: number
      maxTime?: number
    } = {},
  ) {
    super()

    if (options.interval) {
      this.interval = options.interval
    }
  }

  get interval() {
    return this._interval
  }

  set interval(value: number) {
    if (value <= 0) {
      return
    }

    this._interval = value

    if (this._timeout !== undefined) {
      clearInterval(this._timeout)
      this._timeout = setInterval(this._tick, this._interval)
    }
  }

  get maxTime() {
    return this._maxTime
  }

  set maxTime(value: number | undefined) {
    if (typeof value === 'number' && value <= this._interval) {
      return
    }

    this._maxTime = value
  }

  get time() {
    return this._time
  }

  get timeFlags() {
    return [...this._timeFlags]
  }

  get startTime() {
    return this._startTime
  }

  get restartTime() {
    return this._restartTime
  }

  get status() {
    return this._status
  }

  start(interval?: number): Promise<Result> {
    if (this._status !== 'stopped') {
      return Promise.reject({
        message: 'stopwatch should start when stopped',
      })
    }

    if (interval) {
      this.interval = interval
    }

    const now = Date.now()

    this._time = 0
    this._timeFlags = []
    this._startTime = now
    this._restartTime = now
    this._endTime = now
    this._timeBase = 0
    this._timeout = setInterval(this._tick, this._interval)
    this._setStatus('ticking')

    return new Promise((resolve, reject) => {
      this._resolve = resolve
    })
  }

  stop() {
    if (this._status === 'stopped') {
      return
    }

    if (this._timeout !== undefined) {
      clearInterval(this._timeout)
      this._timeout = undefined
    }

    if (this._resolve) {
      this._resolve({
        time: this._time,
        timeFlags: [...this._timeFlags, this._time],
        startTime: this._startTime,
        endTime: this._endTime,
        isOvertime: !!(this._maxTime && this._time >= this._maxTime),
      })
      this._resolve = undefined
    }

    this._time = 0
    this._timeFlags = []
    this._startTime = 0
    this._restartTime = 0
    this._endTime = 0
    this._timeBase = 0
    this._setStatus('stopped')
  }

  pause() {
    if (this._status !== 'ticking') {
      return
    }

    if (this._timeout !== undefined) {
      clearInterval(this._timeout)
      this._timeout = undefined
    }

    this._timeBase += Date.now() - this._restartTime
    this._setStatus('paused')
  }

  resume(interval?: number) {
    if (this._status !== 'paused') {
      return
    }

    if (interval) {
      this.interval = interval
    }

    this._timeout = setInterval(this._tick, this._interval)
    this._restartTime = Date.now()
  }

  private _tick = (isFlag = false) => {
    if (this._status !== 'ticking') {
      return
    }

    const now = Date.now()
    const time = this._timeBase + now - this._restartTime

    if (isFlag) {
      this._timeFlags.push(time)
    }

    this.emit('tick', {
      time,
      timeFlags: [...this._timeFlags],
      startTime: this._startTime,
    })

    this._time = time
    this._endTime = now

    if (this._maxTime && time >= this._maxTime) {
      this.stop()
    }
  }

  private _setStatus(status: Status) {
    if (status === this._status) {
      return
    }

    const prevStatus = this._status
    this._status = status

    this.emit('status-change', { status, prevStatus })
  }
}
