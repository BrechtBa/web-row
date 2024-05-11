"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Grid from '@mui/material/Unstable_Grid2';


import { MeteorWorkoutData } from '@/domain/meteor';
import { getMeteorWorkoutRepository, getWorkoutExecutionRepository } from '@/workoutRepository/factory';
import { WorkoutChart } from '../components';

import styles from "./page.module.css";
import { WideButton } from "@/components/WideButton";
import { CloseButton } from "@/components/CloseButton";
import Link from "next/link";
import { WorkoutExecution } from "@/domain/workoutExecution";
import { TitleBar }  from "@/components/TitleBar";

const workoutRepository = getMeteorWorkoutRepository();
const workoutExecuteionRepository = getWorkoutExecutionRepository();


function RankingEntry({rank, displayName, score}: {rank: number, displayName: string, score: string}) {

  return (
    <div style={{display: "flex", flexDirection: "row", fontSize: "1em", paddingLeft: "1em", paddingRight: "1em", paddingTop: "0.5em", paddingBottom: "0.5em"}}>
      <div style={{width: "2em"}}>
        {rank}
      </div>
      <div>
        
      </div>
      <div style={{flexGrow: 1}}>
        {displayName}
      </div>
      <div>
        {score}
      </div>
    </div>
  );
}

export default function Page() {

  const searchParams = useSearchParams();

  const [workout, setWorkout] = useState<MeteorWorkoutData | null>(null);
  const [workoutExecutions, setWorkoutExecutions] = useState<Array<WorkoutExecution>>([]);

  useEffect(() => {
    const workoutId = searchParams.get('workout');
    if(workoutId !== null) {
      const workout = workoutRepository.getWorkout(workoutId);
      if(workout !== undefined){
        setWorkout(workout);
        setWorkoutExecutions(workoutExecuteionRepository.listWorkoutExecutionsForWorkoutSortedByScore(workout.workoutId));
      }
    }
  }, [searchParams]);

  if(workout === null){
    return null;
  }


  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <TitleBar title={workout.title} icon={(<div>M</div>)}>
        <Link href={"/meteor/"}>
          <CloseButton />
        </Link>
      </TitleBar>

      <div style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
        <div style={{display: "flex", flexDirection: "column", flexGrow: 3}}>
          <div style={{padding: "1em"}}>
            <div className={styles.workoutChart} >
              <WorkoutChart workout={workout.workoutDefinition}/>
            </div>
            <div className={styles.workoutInfo} style={{position: "absolute", bottom: 0, left: 0}}>
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

        <div className={styles.sidePane} style={{display: "flex", flexDirection: "column", width: "20em"}}>
        
          <div>
            <div className={styles.sidePaneTitle}>Ranking</div>
            <div className="rankingContainer">
              {workoutExecutions.map((workoutExecution, index) => (
                <RankingEntry key={workoutExecution.workoutExecutionId} rank={index+1} displayName={workoutExecution.user.displayName} score={`${workoutExecution.result.score}`}/>
              ))}
            </div>
          </div>

        </div>

      </div>

      <div>
        <Link href={`/meteor/workout/run?workout=${workout.workoutId}`}>
          <WideButton>Start workout</WideButton>
        </Link>
      </div>

    </main>
  )
}