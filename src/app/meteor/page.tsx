"use client"
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import { useRouter } from 'next/navigation';
import { TimeDelta } from '@/domain/domain';

import { MeteorWorkoutIntervalDefinition, MeteorWorkoutDefinition } from './domain';
import MeteorWorkoutRepository from './meteorWorkoutRepository';

import styles from "./page.module.css";


function WorkoutChart({workout}: {workout: MeteorWorkoutDefinition}){
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


function Workout({workout}: {workout: MeteorWorkoutDefinition}){
 
  const router = useRouter();
  const href = `/meteor/workout?workout=${workout.workoutId}`;

  return (
    <div>
      <Paper className={styles.paper} style={{cursor: "pointer"}} onClick={() => router.push(href)}>
        <div style={{position: "relative"}}>
          <div className={styles.workoutChart} >
            <WorkoutChart workout={workout}/>
          </div>
          <div className={styles.workoutInfo} style={{position: "absolute", bottom: 0, left: 0}}>
            <div className={styles.workoutTitle}>
            {workout.title}
            </div>
            <div className={styles.workoutDescription}>
            {workout.description}
            </div>
          </div>

        </div>
        <div className={styles.workoutData}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <span className={styles.propertyName}>Duration: </span>
              <span className={styles.propertyValue}>{workout.getTotalDuration().formatMinutesSeconds()}</span>
            </Grid>
          </Grid>
        </div>
        
      </Paper>
    </div>
  )
}

const repository = new MeteorWorkoutRepository()


export default function Page() {

  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "1em"}}>
      <div>
        <Grid container spacing={2}>
          {repository.listWorkouts().map(workout => (
            <Grid key={workout.workoutId} xs={6}>
              <Workout workout={workout} />
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  )
}