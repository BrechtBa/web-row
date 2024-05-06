export enum IntensityZone {
  Paddle = 1,
  Steady,
  Race,
  Sprint,
}


export interface IntensityZoneSplits {
  [IntensityZone.Paddle]: number;
  [IntensityZone.Steady]: number;
  [IntensityZone.Race]: number;
  [IntensityZone.Sprint]: number;
}


export class TimeDelta {
  timeDeltaMs: number;

  constructor(timeDeltaMs: number){
    this.timeDeltaMs = timeDeltaMs;
  }

  public formatMinutesSeconds(): string {
    const minutes = Math.floor(this.timeDeltaMs/60000);
    const seconds = Math.ceil(this.timeDeltaMs/1000 - minutes*60)

    return `${minutes}:${seconds < 10? "0" : ""}${seconds}`
  }


  public add(timeDelta: TimeDelta): TimeDelta {
    return new TimeDelta(this.timeDeltaMs + timeDelta.timeDeltaMs)
  }

  public subtract(timeDelta: TimeDelta): TimeDelta {
    return new TimeDelta(this.timeDeltaMs - timeDelta.timeDeltaMs)
  }

}


export const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));