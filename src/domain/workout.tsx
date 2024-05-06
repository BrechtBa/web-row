import { MeteorWorkoutDefinition } from './meteor';
import { IntensityZoneSplits } from './intensityZone'


export interface Workout {
  workoutId: string;
  title: string;
  description: string;
}


// export enum WorkoutType {
//   Meteor = "METEOR",
//   Race = "RACE",
// }


// export class RaceWorkoutDefinition {

// }


// export class Workout {
//   meteorWorkoutDefinition: MeteorWorkoutDefinition | null;
//   raceWorkoutDefinition: RaceWorkoutDefinition | null;

//   constructor(meteorWorkoutDefinition: MeteorWorkoutDefinition | null, raceWorkoutDefinition: RaceWorkoutDefinition | null) {
//     this.meteorWorkoutDefinition = meteorWorkoutDefinition;
//     this.raceWorkoutDefinition = raceWorkoutDefinition
//   }

//   type(): WorkoutType {
//     if(this.meteorWorkoutDefinition !== null) {
//       return WorkoutType.Meteor;
//     }

//     return WorkoutType.Race;
//   }

// }


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


export class WorkoutUser {

  displayName: string
  rank: Rank
  intensityZoneSplits: IntensityZoneSplits

  constructor(displayName: string, intensityZoneSplits: IntensityZoneSplits, rank: Rank){
    this.displayName = displayName;
    this.rank = rank
    this.intensityZoneSplits = intensityZoneSplits
  }

}
