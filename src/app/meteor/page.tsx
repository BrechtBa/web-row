"use client"
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import {  MeteorWorkoutDefinition } from '../../domain/meteor';
import { getMeteorWorkoutRepository } from '@/workoutRepository/factory';

import { WorkoutChart } from './components';

import styles from "./page.module.css";


function WorkoutCard({workout}: {workout: MeteorWorkoutDefinition}){
 
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



const workoutRepository = getMeteorWorkoutRepository();


export default function Page() {
  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "1em"}}>
      <div>
        <Grid container spacing={2}>
          {workoutRepository.listWorkouts().map(workout => (
            <Grid key={workout.workoutId} xs={6}>
              <WorkoutCard workout={workout} />
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  )
}