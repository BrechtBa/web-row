"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';

import { TimeDelta } from '@/domain/domain';
import { MeteorWorkoutIntervalDefinition, MeteorWorkoutDefinition } from '../domain';
import MeteorWorkoutRepository from '../meteorWorkoutRepository';
import { WorkoutChart } from '../components';

import styles from "../page.module.css";


const workoutRepository = new MeteorWorkoutRepository()


function WorkoutPage({workout}: {workout: MeteorWorkoutDefinition | null}) {
  const router = useRouter();

  const href = workout!== null ? `/meteor/workout?workout=${workout.workoutId}`: "/meteor"

  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "1em"}}>
      { workout!== null && (
        <div>
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
          <div>
            <Button className={styles.startWorkoutButton} onClick={() => router.push(href)}>Start workout</Button>
          </div>

          <div style={{position: "absolute", top: 0, right: 0}}>
            <Button onClick={() => router.push("/meteor")} >Back</Button>
          </div>
        </div>
      )}
    </main>
  )
}


export default function Page() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const [workout, setWorkout] = useState<MeteorWorkoutDefinition | null>(null);
  const href = workout!== null ? `/meteor/workout/run?workout=${workout.workoutId}`: "/meteor"


  useEffect(() => {
    const workoutId = searchParams.get('workout');
    if(workoutId !== null) {
      const workout = workoutRepository.getWorkout(workoutId);
      if(workout !== undefined){
        setWorkout(workout);
      }
    }
  }, [searchParams]);

  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "1em"}}>
      { workout!== null && (
        <div>
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
          <div>
            <Button className={styles.startWorkoutButton} onClick={() => router.push(href)}>Start workout</Button>
          </div>

          <div style={{position: "absolute", top: 0, right: 0}}>
            <Button onClick={() => router.push("/meteor")} >Back</Button>
          </div>
        </div>
      )}
    </main>
  )
}