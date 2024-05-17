import { getFirestore, Firestore, collection, getDoc, doc, setDoc, updateDoc, query, getDocs, where, orderBy, limit  } from 'firebase/firestore/lite';

import { app } from "@/firebase"

import { TimeDelta, IntensityZone } from "@/domain/intensityZone";

import { MeteorWorkoutRepository } from './interface';
import { MeteorWorkout, MeteorWorkoutDefinition, MeteorWorkoutIntervalDefinition, MeteorWorkoutTargetDefinition } from '@/domain/meteor';


interface MeteorWorkoutObject {
  workoutId: string;
  title: string
  description: string
  workoutDefinition: {
    intervals: Array<{
      duration: number;
      intensityZone: number;
      targets: Array<{
        time: number; 
        target: {
          points: number
        }
      }>
    }>;
  }
}


export class FirebaseMeteorWorkoutRepository implements MeteorWorkoutRepository {
  firestore: Firestore;
  collectionName = "meteorWorkouts";

  constructor(){
    this.firestore = getFirestore(app);
  }

  async listWorkouts(lim?: number, offset? : number): Promise<Array<MeteorWorkout>> {
    lim = lim === undefined ? 10 : lim;
    offset = offset === undefined ? 0 : offset;

    const q = query(
      collection(this.firestore, this.collectionName), 
      limit(lim),
    );
    const querySnapshot = await getDocs(q);

    return new Promise((resolve) => resolve(querySnapshot.docs.map(
      doc => this.objectToWorkout(doc.data() as MeteorWorkoutObject)
    )));
  }

  async getWorkoutByWorkoutId(workoutId: string): Promise<MeteorWorkout | undefined> {
    const docSnap = await getDoc(doc(this.firestore, this.collectionName, workoutId))
    if (!docSnap.exists()) {
      return Promise.reject();
    }
    return new Promise((resolve) => {
      return resolve(this.objectToWorkout(docSnap.data() as MeteorWorkoutObject));
    });
  }

  storeWorkout(workout: MeteorWorkout): void {
    setDoc(doc(this.firestore,  this.collectionName, workout.workoutId), {
      ...this.workoutToObject(workout),
    });
  }

  private workoutToObject(workout: MeteorWorkout): MeteorWorkoutObject{
    return {
      workoutId: workout.workoutId,
      title: workout.title,
      description: workout.description,
      workoutDefinition: {
        intervals: workout.workoutDefinition.segments.map(interval => ({
          duration: interval.duration.timeDeltaMs,
          intensityZone: interval.intensityZone,
          targets: interval.targets.map(target => ({
            time: target.time.timeDeltaMs,
            target: {
              points: target.target.points
            }
          }))
        }))
      }
    }
  }

  private objectToWorkout(obj: MeteorWorkoutObject): MeteorWorkout {
    return new MeteorWorkout(
      obj.workoutId,
      obj.title,
      obj.description,
      new MeteorWorkoutDefinition(
        obj.workoutDefinition.intervals.map(interval => new MeteorWorkoutIntervalDefinition(
          new TimeDelta(interval.duration),
          interval.intensityZone as unknown as IntensityZone,
          interval.targets.map(target => ({
            time: new TimeDelta(target.time),
            target: new MeteorWorkoutTargetDefinition(target.target.points)
          }))
        ))
      )
    );
  }
}

// const w =   MeteorWorkout.create(
//   "Very short", "test",
//   new MeteorWorkoutDefinition([
//     new MeteorWorkoutIntervalDefinition(new TimeDelta(1*1000), IntensityZone.Paddle, [
//       {time: new TimeDelta(500), target: new MeteorWorkoutTargetDefinition(1)}
//     ]),
//     new MeteorWorkoutIntervalDefinition(new TimeDelta(1*1000), IntensityZone.Sprint, [
//       {time: new TimeDelta(500), target: new MeteorWorkoutTargetDefinition(4)}
//     ]),
//   ])
// )

// const repo = new FirebaseMeteorWorkoutRepository();
// repo.storeWorkout(w)
