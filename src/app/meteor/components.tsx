"use client"


import { TimeDelta } from '@/domain/domain';
import { MeteorWorkoutIntervalDefinition, MeteorWorkoutDefinition } from './domain';

import styles from "./page.module.css";


export function WorkoutChart({workout}: {workout: MeteorWorkoutDefinition}){
  const segmentHeight = (interval: MeteorWorkoutIntervalDefinition): number => {
    return 200 - interval.intensityZone * 40
  }
  const totalWorkoutDuration = workout.getTotalDuration();

  const segmentLength = (duration: TimeDelta): number => {
    return duration.timeDeltaMs / totalWorkoutDuration.timeDeltaMs * 1000 ;
  }

  const calculatePath = (workout: MeteorWorkoutDefinition): string => {

    let timeDeltaMs: number = 0
    let d: string = "";
    let x1: number = 0;
    for (var i = 0; i < workout.segments.length; i +=1) {
      if( i == 0 ) {
        d += " M"
      }
      else {
        d += " L"
      }

      let y = segmentHeight(workout.segments[i]);

      let x2 = x1 + segmentLength(workout.segments[i].duration);
      d += ` ${x1}, ${y} L ${x2}, ${y}`;
      timeDeltaMs += workout.segments[i].duration.timeDeltaMs;
      x1 = x2;
    }
    return d;
  }

  return (
    <div style={{display: "flex", width: "100%"}}>
      <svg width="100%" viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg">
        <path id="OverviewGraph" className={styles.workoutChartLine} fill="none"
           d={calculatePath(workout)} />
      </svg>
    </div>
  )
}
