"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import getRower from '@/rower/factory';
import { IntensityZone } from '@/domain/intensityZone';
import { MeteorWorkoutData } from '@/domain/meteor';
import { getMeteorWorkoutRepository } from '@/workoutRepository/factory';
import { MeteorWorkout, MeteorData } from './domain';


import styles from "./page.module.css";
import { WideButton } from '@/components/WideButton';
import { WorkoutVelocityChart } from '@/components/WorkoutVelocityChart';
import { WorkoutOverviewGraph, CurrentScore, SegmentIntervalStats, HighScore, TimeRemaining, GameArea } from './gameComponents';
import Link from 'next/link';


const rower = getRower();
const workoutRepository = getMeteorWorkoutRepository();


const intensityZoneSplits =   {
  [IntensityZone.Paddle]: 500 / 3.0 * 1000,
  [IntensityZone.Steady]: 500 / 3.5 * 1000,
  [IntensityZone.Race]: 500 / 4.0 * 1000,
  [IntensityZone.Sprint]: 500 / 4.5 * 1000
}


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

      <div style={{width: "100%", flexGrow: 1, position: "relative"}}>
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

function FinishedMeteorWorkout({workout}: {workout: MeteorWorkout}) {

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
        <Link href="/">       
          <WideButton>Save stats</WideButton>
        </Link>
      </div>
    </div>
  );
}



export default function Page() {

  const dt = 20;
  const searchParams = useSearchParams();

  const [workoutData, setWorkoutData] = useState<MeteorWorkoutData | null>(null);
  const [workout, setWorkout] = useState<MeteorWorkout | null>(null);
  const [meteorData, setMeteorData] = useState<MeteorData>(MeteorWorkout.getInitialData());
  const [workoutFinished, setWorkoutFinished] = useState<boolean>(false);

  useEffect(() => {
    rower.start();
  }, []);

  useEffect(() => {
    const workoutId = searchParams.get('workout');
    if(workoutId !== null) {
      const workoutData = workoutRepository.getWorkout(workoutId);
      if( workoutData !== undefined ){
        setWorkoutData(workoutData);
        setWorkout(new MeteorWorkout(workoutData.workoutDefinition, intensityZoneSplits));
      }
    }
  }, [searchParams]);


  useEffect(() => {
    let frameRefreshTimer: ReturnType<typeof setTimeout> | null = null
    
    if(workout !== null) {
      // start the workout
      workout.start();

      // start the ui update loop
      const uiUpdateLoop = () => {
        const newMeteorData = workout.update(new Date(), rower);
  
        if(workout.finished){
          setWorkoutFinished(true);
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
    
  }, [workout]);

  return (
    <main style={{width: "100%", height: "100%"}}>

      {!workoutFinished && workout !== null && !workoutFinished && (
        <RunningMeteorWorkout workout={workout} meteorData={meteorData} />
      )}

      {workout !== null && workoutFinished && (
        <FinishedMeteorWorkout workout={workout} />
      )}

    </main>
  );
}