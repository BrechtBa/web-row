import { getFirestore, Firestore, collection, getDoc, doc, setDoc, updateDoc, query, getDocs, where, orderBy, limit  } from 'firebase/firestore/lite';

import { app } from "@/firebase"

import { TimeDelta, IntensityZone } from "@/domain/intensityZone";
import { User, Rank } from "@/domain/user";
import { MeteorWorkoutResult, WorkoutExecution } from "@/domain/workoutExecution";

import { MeteorWorkoutExecutionRepository } from './interface';


const undefinedUser = new User(
  "undefined",  
  "Unknown", 
  {[IntensityZone.Paddle]: 400, [IntensityZone.Steady]: 300, [IntensityZone.Race]: 200, [IntensityZone.Sprint]: 100}, 
  Rank.X
)


interface MeteorWorkoutExecutionObject {
  workoutExecutionId: string;
  workoutId: string;
  userId: string;
  resultDistance: number;
  resultTime: number;
  resultScore: number;
  resultTargets: number;
}


export class FirebaseMeteorWorkoutExecutionRepository implements MeteorWorkoutExecutionRepository{
  firestore: Firestore;

  constructor(){
    this.firestore = getFirestore(app);
  }

  async listWorkoutExecutionsForWorkoutSortedByScore(workoutId: string, lim?: number): Promise<Array<WorkoutExecution<MeteorWorkoutResult>>> {
    lim = lim === undefined ? 10 : lim;

    const q = query(
      collection(this.firestore, "meteorWorkoutExecutions"), 
      where("workoutId", "==", workoutId), 
      orderBy("resultScore", "desc"), 
      limit(lim),
    );
    const querySnapshot = await getDocs(q);

    return new Promise((resolve) => resolve(querySnapshot.docs.map(
      doc => this.objectToWorkoutExecution(doc.data() as MeteorWorkoutExecutionObject)
    )));
  }

  storeWorkoutExecution(workoutExecution: WorkoutExecution<MeteorWorkoutResult>): void {
    setDoc(doc(this.firestore, "meteorWorkoutExecutions", workoutExecution.workoutExecutionId), {
      ...this.workoutExecutionToObject(workoutExecution),
    });
  }

  private workoutExecutionToObject(execution: WorkoutExecution<MeteorWorkoutResult>): MeteorWorkoutExecutionObject{
    return {
      workoutExecutionId: execution.workoutExecutionId,
      workoutId: execution.workoutId,
      userId: execution.userId,
      resultDistance: execution.result.distance,
      resultTime: execution.result.time.timeDeltaMs,
      resultScore: execution.result.score,
      resultTargets: execution.result.targets,
    }
  }

  private objectToWorkoutExecution(execution: MeteorWorkoutExecutionObject): WorkoutExecution<MeteorWorkoutResult>{
    return new WorkoutExecution(
      execution.workoutExecutionId,
      execution.workoutId,
      execution.userId,
      {
        distance: execution.resultDistance,
        time: new TimeDelta(execution.resultTime),
        score: execution.resultScore,
        targets: execution.resultTargets,
      }
    )
  }
}