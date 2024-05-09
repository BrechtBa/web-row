"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Grid from '@mui/material/Unstable_Grid2';


import { MeteorWorkoutData } from '@/domain/meteor';
import { getMeteorWorkoutRepository } from '@/workoutRepository/factory';
import { WorkoutChart } from '../components';

import styles from "../page.module.css";
import { WideButton } from "@/components/WideButton";
import { FloatingCloseButton } from "@/components/FloatingCloseButton";
import Link from "next/link";

const workoutRepository = getMeteorWorkoutRepository();


export default function Page() {

  const searchParams = useSearchParams();

  const [workout, setWorkout] = useState<MeteorWorkoutData | null>(null);

  useEffect(() => {
    const workoutId = searchParams.get('workout');
    if(workoutId !== null) {
      const workout = workoutRepository.getWorkout(workoutId);
      if(workout !== undefined){
        setWorkout(workout);
      }
    }
  }, [searchParams]);

  if(workout === null){
    return null;
  }


  return (
    <main style={{width: "100%", height: "100%"}}>
      <div style={{display: "flex", flexDirection: "column", height: "100%", overflowY: "scroll"}}>
        <div style={{padding: "1em", flexGrow: 1}}>
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

        <div>
          <Link href={workout!== null ? `/meteor/workout/run?workout=${workout.workoutId}`: "/meteor"}>
            <WideButton>Start workout</WideButton>
          </Link>
        </div>

      </div>
      <Link href={"/meteor/"}>
        <FloatingCloseButton />
      </Link>
    </main>
  )
}