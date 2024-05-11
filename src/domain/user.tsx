import { IntensityZone, IntensityZoneSplits } from "./intensityZone";


export enum Rank {
  I = 1,
  II,
  III,
  IV,
  V,
  VI,
  VII,
  VIII,
  IX,
  X,
}


export class User {
  userId: string;
  displayName: string;
  intensityZoneSplits: IntensityZoneSplits;
  rank: Rank;

  constructor(user_id: string, displayName: string, intensityZoneSplits: IntensityZoneSplits, rank: Rank) {
      this.userId = "test"
      this.displayName = displayName;
      this.intensityZoneSplits = intensityZoneSplits;
      this.rank = rank;
  }
}


export const guestUser = new User(
  "guestuser12b9-4cf7-825b-5651ba545789",
  "Guest",
  {
    [IntensityZone.Paddle]: 500 / 3.0 * 1000,
    [IntensityZone.Steady]: 500 / 3.5 * 1000,
    [IntensityZone.Race]: 500 / 4.0 * 1000,
    [IntensityZone.Sprint]: 500 / 4.5 * 1000
  },
  Rank.IV,
)
