"use client"


import { TimeDelta } from '@/domain/intensityZone';
import { MeteorWorkoutIntervalDefinition, MeteorWorkoutDefinition } from '../../domain/meteor';

import styles from "./page.module.css";


export function WorkoutChart({workout, height}: {workout: MeteorWorkoutDefinition, height: number}){
  const segmentHeight = (interval: MeteorWorkoutIntervalDefinition): number => {
    return height - interval.intensityZone * 0.2 * height
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
      <svg width="100%" viewBox={`0 0 1000 ${1.5*height}`} xmlns="http://www.w3.org/2000/svg">
        <path id="OverviewGraph" className={styles.workoutChartLine} fill="none"
           d={calculatePath(workout)} />
      </svg>
    </div>
  )
}
