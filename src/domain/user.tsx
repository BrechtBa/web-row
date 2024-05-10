import { IntensityZone, IntensityZoneSplits } from "./intensityZone";


export interface User {
  displayName: string;
  intensityZoneSplits: IntensityZoneSplits;
}


export const guestUser = {
  displayName: "Guest",
  intensityZoneSplits: {
    [IntensityZone.Paddle]: 500 / 3.0 * 1000,
    [IntensityZone.Steady]: 500 / 3.5 * 1000,
    [IntensityZone.Race]: 500 / 4.0 * 1000,
    [IntensityZone.Sprint]: 500 / 4.5 * 1000
  }
}