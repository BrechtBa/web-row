"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Unstable_Grid2';

import { MeteorWorkout } from '@/domain/meteor';
import { getMeteorWorkoutRepository } from '@/factory';

import { WorkoutChart } from './components';

import styles from "./page.module.css";
import { CloseButton } from '@/components/Buttons';
import { TitleBar } from '@/components/TitleBar';
import { meteorWorkoutUseCases } from './workout/useCases';


function WorkoutCard({workout}: {workout: MeteorWorkout}){
 
  return (
    <div className="paper" style={{cursor: "pointer"}}>
      <div style={{position: "relative"}}>
        <div className={styles.workoutChart} >
          <WorkoutChart workout={workout.workoutDefinition} height={200}/>
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
            <span className={styles.propertyValue}>{workout.workoutDefinition.getTotalDuration().formatMinutesSeconds()}</span>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}



const workoutRepository = getMeteorWorkoutRepository();


export default function Page() {
  const [workouts, setWorkouts] = useState<Array<MeteorWorkout>>([])

  useEffect(() => {
    meteorWorkoutUseCases.listWorkouts().then((data) => {
      setWorkouts(data);
    })
  }, []);

  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <TitleBar title="Meteor" icon={(<div>M</div>)}>
        <Link href="/">
          <CloseButton />
        </Link>
      </TitleBar>

      <div style={{padding: "1em", overflowY: "scroll"}}>
        <Grid container spacing={2}>
          {workouts.map(workout => (
            <Grid key={workout.workoutId} xs={6}>
              <Link href={`/meteor/workout?workout=${workout.workoutId}`}>
                <WorkoutCard workout={workout} />
              </Link>
            </Grid>
          ))}

            <Grid xs={6}>
              <Link href={`/meteor/new`}>
                <div className="paper" style={{cursor: "pointer"}}>
                  <div>Add Workout</div>
                </div>
              </Link>
            </Grid>

        </Grid>
      </div>
      
    </main>
  )
}