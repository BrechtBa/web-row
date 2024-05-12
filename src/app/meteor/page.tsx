"use client"
import Link from 'next/link'
import Grid from '@mui/material/Unstable_Grid2';

import { MeteorWorkoutData } from '@/domain/meteor';
import { getMeteorWorkoutRepository } from '@/workoutRepository/factory';

import { WorkoutChart } from './components';

import styles from "./page.module.css";
import { CloseButton } from '@/components/Buttons';
import { TitleBar } from '@/components/TitleBar';


function WorkoutCard({workout}: {workout: MeteorWorkoutData}){
 
  return (
    <div>
      <Link href={`/meteor/workout?workout=${workout.workoutId}`}>
        <div className="paper" style={{cursor: "pointer"}}>
          <div style={{position: "relative"}}>
            <div className={styles.workoutChart} >
              <WorkoutChart workout={workout.workoutDefinition}/>
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
      </Link>
    </div>
  )
}



const workoutRepository = getMeteorWorkoutRepository();


export default function Page() {
  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <TitleBar title="Meteor" icon={(<div>M</div>)}>
        <Link href="/">
          <CloseButton />
        </Link>
      </TitleBar>

      <div style={{padding: "1em", overflowY: "scroll"}}>
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