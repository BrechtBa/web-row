"use client"
import React, { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { RowerContext, UserContext } from '@/app/contextProviders';

import Rower from '@/rower/interface';
import getRower from '@/rower/factory';
import { MeteorWorkoutData } from '@/domain/meteor';
import { getMeteorWorkoutRepository, getWorkoutExecutionRepository } from '@/workoutRepository/factory';
import { MeteorWorkout, MeteorData } from './domain';

import { WideButton } from '@/components/WideButton';
import { WorkoutVelocityChart } from '@/components/WorkoutVelocityChart';
import { WorkoutOverviewGraph, CurrentScore, SegmentIntervalStats, HighScore, TimeRemaining, GameArea } from './gameComponents';


import styles from "./page.module.css";
import { WorkoutExecution } from '@/domain/workoutExecution';
import { User } from '@/domain/user';


function RunningMeteorWorkout({workout, meteorData}: {workout: MeteorWorkout, meteorData: MeteorData}) {

  return (
    <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <div style={{display: "flex", flexDirection: "row", marginTop: "1em", marginLeft: "1em", marginRight: "1em", marginBottom: "1em"}}>
        <div style={{width: "10vw"}}>
          left
        </div>
        <div style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
            <div>
              <WorkoutOverviewGraph workout={workout} time={meteorData.time}/>
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <CurrentScore score={meteorData.score}/>
              <SegmentIntervalStats activeSegmentIndex={meteorData.activeSegment.index} totalSegments={meteorData.totalSegments} timeRemaining={meteorData.activeSegment.timeRemaining} />
              <HighScore score={0}/>
            </div>
        </div>
        <div style={{width: "10vw"}}>
          <TimeRemaining timeRemaining={meteorData.timeRemaining}/>
        </div>
      </div>

      <div style={{width: "100%", flexGrow: 1}}>
        test
        <GameArea
            workout={workout}
            meteorDistance={meteorData.meteorDistance}
            instantaneousVelocity={meteorData.instantaneousVelocity}
            meteorTrace={meteorData.meteorTrace}
            meteorBoundsTrace={workout.meteorBoundsTrace}
            targets={meteorData.targets}/>
      </div>

      <div style={{display: "flex", height: "5em"}}>
        Footer
      </div>
    </div>  
  );
}

function FinishedMeteorWorkout({workout, user}: {workout: MeteorWorkout, user: User}) {

  const router = useRouter();
  const workoutExecuteionRepository = getWorkoutExecutionRepository()
  const saveStats = () => {
    workoutExecuteionRepository.storeWorkoutExecution(
      WorkoutExecution.create(workout.workoutData, user, {distance: 1234, time: workout.totalDuration})
    )
    router.push("/");
  }


  return (
    <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <div style={{flexGrow: 1}}>
        <div>
          Title
        </div>
        <div>
          <WorkoutVelocityChart velocityHistory={workout.velocityHistory} intervalTimes={workout.segments.map(interval => interval.startTime)}/>
          <div style={{width: "100%", backgroundColor: "rgba(var(--important-rgb), 1.0)"}}>
            test
          </div>
        </div>

        <div>
          stats
        </div>
      </div>
      
      <div>           
        <WideButton onClick={saveStats}>Save stats</WideButton>
      </div>
    </div>
  );
}



const workoutRepository = getMeteorWorkoutRepository();


export default function Page() {

  const dt = 20;
  const searchParams = useSearchParams();

  const [rower, setRower] = useState<Rower | null>(null);
  const [workoutData, setWorkoutData] = useState<MeteorWorkoutData | null>(null);
  const [workout, setWorkout] = useState<MeteorWorkout | null>(null);
  const [meteorData, setMeteorData] = useState<MeteorData>(MeteorWorkout.getInitialData());
  const [timeToStart, setTimeToStart] = useState<number>(10);
  const [workoutFinished, setWorkoutFinished] = useState<boolean>(false);
  const [workoutStopped, setWorkoutStopped] = useState<boolean>(false);

  const {rowerType} = useContext(RowerContext)
  const {user} = useContext(UserContext)


  useEffect(() => {
    setRower(getRower(rowerType));
  }, [rowerType]);


  useEffect(() => {
    if(rower!==null){
      rower.start();
    }
  }, [rower]);


  useEffect(() => {
    const workoutId = searchParams.get('workout');
    if(workoutId !== null) {
      const workoutData = workoutRepository.getWorkout(workoutId);
      if( workoutData !== undefined ){
        setWorkoutData(workoutData);
        setWorkout(new MeteorWorkout(workoutData, user.intensityZoneSplits));
      }
    }
  }, [searchParams, user]);


  useEffect(() => {
    let frameRefreshTimer: ReturnType<typeof setTimeout> | null = null
    
    if(workout !== null && rower !== null) {
      // start the workout
      workout.start();

      // start the ui update loop
      const uiUpdateLoop = () => {
        const newMeteorData = workout.update(new Date(), rower);
  
        if(newMeteorData.time.timeDeltaMs < 500){
          setTimeToStart(Math.round(-newMeteorData.time.timeDeltaMs / 1000));
        }

        if(newMeteorData.time.timeDeltaMs > workout.totalDuration.timeDeltaMs){
          setWorkoutFinished(true);
        }

        if(workout.finished){
          setWorkoutStopped(true);
          rower.stop();
          return;  // do not call frameRefresh to break the loop
        }
  
        setMeteorData(newMeteorData);
  
        frameRefreshTimer = setTimeout(() => {
          uiUpdateLoop();
        }, dt)
      }

      uiUpdateLoop();
  
      return () => {
        if(frameRefreshTimer !== null) {
          clearTimeout(frameRefreshTimer);
        }
      }
    }
    
  }, [workout, rower]);


  return (
    <main style={{width: "100%", height: "100%"}}>

      {workout !== null && rower !== null && !workoutStopped && (
        <RunningMeteorWorkout workout={workout} meteorData={meteorData} />
      )}

      {workout !== null && rower !== null && timeToStart > 0 && (
        <div className={styles.startSplashScreen} style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div>
            {timeToStart}
          </div>
        </div>
      )}

      {workout !== null && rower !== null && workoutFinished && !workoutStopped && (
        <div className={styles.finishedSplashScreen} style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div>
            Workout Finished
          </div>
        </div>
      )}

      {workout !== null && workoutStopped && (
        <FinishedMeteorWorkout workout={workout} user={user}/>
      )}

    </main>
  );
}