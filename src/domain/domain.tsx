export enum IntensityZone {
  Paddle = 1,
  Steady,
  Race,
  Sprint,
}


interface IntensityZoneSplits {
  [IntensityZone.Paddle]: number;
  [IntensityZone.Steady]: number;
  [IntensityZone.Race]: number;
  [IntensityZone.Sprint]: number;
}
