'use client'
import { useState } from "react";

import { AddButton, CloseButton, WideButton } from "@/components/Buttons";
import { TitleBar } from "@/components/TitleBar";
import { TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from 'next/navigation'

import { WorkoutChart } from "../components";
import { MeteorWorkout, MeteorWorkoutDefinition, MeteorWorkoutIntervalDefinition } from "@/domain/meteor";
import { IntensityZone, TimeDelta } from "@/domain/intensityZone";
import { IntensityZoneSelect } from "@/components/Workout";
import { meteorWorkoutUseCases } from "../workout/useCases";

export default function CreateMeteorWorkout() {

  const [workout, setWorkout] = useState<MeteorWorkout>(MeteorWorkout.create("", "", new MeteorWorkoutDefinition([
    new MeteorWorkoutIntervalDefinition(new TimeDelta(20000), IntensityZone.Paddle)
  ])))

  const router = useRouter();

  const makeIntervals = (workout: MeteorWorkout) => {
    return workout.workoutDefinition.segments.map((interval, index) =>({
      key: index,
      interval: interval
    }))
  }
  
  console.log(workout)

  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <TitleBar title="New workout" icon={(<div>M</div>)}>
        <Link href="/meteor">
          <CloseButton />
        </Link>
      </TitleBar>

      <div style={{display: "flex", flexDirection: "column", gap: "1em", padding: "1em"}}>
        <TextField label="Title" value={workout.title} onChange={(e) => setWorkout(workout.updateTitle(e.target.value))}/>
        <TextField label="Description" value={workout.description} onChange={(e) => setWorkout(workout.updateDescription(e.target.value))}/>
      </div>

      <WorkoutChart workout={workout.workoutDefinition} height={50}/>

      <div style={{padding: "1em", overflowY: "scroll"}}>

        <h1>Intervals</h1>
        <div style={{display: "flex", flexDirection: "column", gap: "1em"}}>
          {makeIntervals(workout).map(interval => (
            <div key={interval.key} style={{display: "flex", flexDirection: "row", gap: "1em"}}>
              <TextField label="Duration" value={interval.interval.duration.timeDeltaMs/1000} onChange={(e) => {setWorkout(workout.updateInterval(interval.key, interval.interval.updateDuration(new TimeDelta(parseInt(e.target.value) * 1000))))}}/>
              <IntensityZoneSelect intensityZone={interval.interval.intensityZone} setIntensityZone={(intensityZone) => setWorkout(workout.updateInterval(interval.key, interval.interval.updateIntensityZone(intensityZone)))}/>
            </div>
          ))}
        </div>
        <div style={{height: "2em"}}>
          <AddButton onClick={()=> {setWorkout(workout.addInterval(new MeteorWorkoutIntervalDefinition(new TimeDelta(30000), IntensityZone.Paddle)))}}></AddButton>
        </div>

      </div>

      <WideButton onClick={() => meteorWorkoutUseCases.storeWorkout(workout).then(() => router.push("/meteor"))}>Save</WideButton>

    </main>
  )
}