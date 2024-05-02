"use client"
import React, { useState, useEffect, useRef } from "react";

import getRower from '../../rower/factory'
import { IntensityZone, TimeDelta, range } from '../../domain/domain'
import { MeteorWorkoutDefSegment, MeteorWorkoutDef, MeteorWorkout, MeteorWorkoutSegment } from './domain'

import styles from "./page.module.css";


function calculateSmoothPath(data: number[][], k?: number) {
  if (k == null) k = 1.0;

  var size = data.length;
  var last = size - 2;

  var path = "M" + [data[0][0], data[0][1]];

  for (var i = 0; i < size - 1; i +=1) {

    var x0 = i ? data[i - 1][0] : data[0][0];
    var y0 = i ? data[i - 1][1] : data[0][1];

    var x1 = data[i + 0][0];
    var y1 = data[i + 0][1];

    var x2 = data[i + 1][0];
    var y2 = data[i + 1][1];

    var x3 = i !== size-2 ? data[i + 2][0] : x2;
    var y3 = i !== size-2 ? data[i + 2][1] : y2;

    var cp1x = x1 + (x2 - x0) / 6 * k;
    var cp1y = y1 + (y2 - y0) / 6 * k;

    var cp2x = x2 - (x3 - x1) / 6 * k;
    var cp2y = y2 - (y3 - y1) / 6 * k;

    path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
  }
  return path;
}



function MeteorTrace({instantaneousVelocity, meteorTrace, meteorDistance, distanceToPixels, velocityToPixels}: 
                     {instantaneousVelocity: number, meteorTrace: number[][], meteorDistance: number, distanceToPixels: (d: number) => number, velocityToPixels: (v: number) => number}) {
  const ORB_RADIUS = 20;

  let fullMeteorTrace = meteorTrace;

  if(meteorTrace[meteorTrace.length-1][0] < meteorDistance - 0.1){
    fullMeteorTrace = meteorTrace.concat([[meteorDistance, instantaneousVelocity]]);
  }

  const path = calculateSmoothPath(fullMeteorTrace.map(
    p => [distanceToPixels(p[0]), velocityToPixels(p[1])]));

  return (
    <div style={{width: "100%", height: "100%", position: "absolute"}}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="Gradient1" x1="1" x2="0.6" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(var(--important-rgb), 1)" />
            <stop offset="100%" stopColor="rgba(var(--important-rgb), 0)"/>
          </linearGradient>
          <radialGradient id="OrbRadialGradient">
            <stop offset="0%" stopColor="rgba(var(--foreground-rgb), 0.5)"/>
            <stop offset="100%" stopColor="rgba(var(--foreground-rgb), 0.0)"/>
          </radialGradient>
        </defs>

        <circle r={2*ORB_RADIUS} cx={distanceToPixels(meteorDistance)} cy={velocityToPixels(instantaneousVelocity)} fill="url(#OrbRadialGradient)" />

        <path stroke="url(#Gradient1)" strokeWidth={1.8*ORB_RADIUS} fill="none" d={path} strokeLinecap="butt" />
        <path stroke="rgba(var(--important-rgb), 1)" strokeWidth="3" fill="none" d={path} />

        <circle r={ORB_RADIUS} cx={distanceToPixels(meteorDistance)} cy={velocityToPixels(instantaneousVelocity)} fill="rgba(var(--foreground-rgb), 1)" />

      </svg>
    </div>
  )
}


function VerticalGrid({x}: {x: number}) {
  const left = `${x}px`;
  return (
    <div style={{width: "100px", height: "100%", position: "absolute", left: left, bottom: 0}}>
      <svg  height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <path stroke="rgba(var(--edge-rgb), 0.5)" strokeWidth="2px" strokeOpacity="1" strokeDasharray="0.3" strokeDashoffset="0"
           d="M 0,0 V 800" />
      </svg>
    </div>
  )
}


function MeteorBounds({meteorDistance, distanceToPixels, velocityToPixels, meteorBoundsTrace}: 
                      {meteorDistance: number,  distanceToPixels: (d: number) => number, velocityToPixels: (c: number) => number, meteorBoundsTrace: Array<{distance: number, min: number, max: number}>}) {

  let filledTrace = [...meteorBoundsTrace]                      
  // fill up screen
  if(meteorDistance - 20 < filledTrace[0].distance){
    let fillBeforeTrace = range(meteorDistance - 20, Math.min(meteorDistance + 20, filledTrace[0].distance), 0.5).map((d) => {
      return {distance: d, min: filledTrace[0].min, max: filledTrace[0].max}
    })
    filledTrace = fillBeforeTrace.concat(filledTrace)
  }

  let index = filledTrace.length-1;
  if(meteorDistance + 20 > filledTrace[index].distance){
    let fillAfterTrace = range(Math.max(meteorDistance - 20, filledTrace[index].distance+0.5) , meteorDistance + 20, 0.5).map((d) => {
      return {distance: d, min: filledTrace[index].min, max: filledTrace[index].max}
    })
    filledTrace = filledTrace.concat(fillAfterTrace);
  }

  const filteredTrace = filledTrace.filter(v => Math.abs(v.distance - meteorDistance) < 40);

  let fullBoundsTrace: Array<Array<number>> = [];

  fullBoundsTrace = fullBoundsTrace.concat(filteredTrace.map(v => [v.distance, v.min]));
  fullBoundsTrace = fullBoundsTrace.concat(filteredTrace.reverse().map(v => [v.distance, v.max]));

  const path = calculateSmoothPath(fullBoundsTrace.map(
      p => [distanceToPixels(p[0]), velocityToPixels(p[1])]));

  return (
    <div style={{width: "100%", height: "100%", position: "absolute"}}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="radialGradient" fx="0.5" fy="0.5" cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="rgba(var(--foreground-rgb), 0.2)"/>
            <stop offset="100%" stopColor="rgba(var(--foreground-rgb), 0.3)"/>
          </radialGradient>
        </defs>

        <path fill="url(#radialGradient)" strokeWidth="1" d={path} />

      </svg>
    </div>
  )
}

function GameArea({workout, meteorDistance, instantaneousVelocity, meteorTrace, meteorBoundsTrace}: 
                  {workout: MeteorWorkout, meteorDistance: number, instantaneousVelocity: number, meteorTrace: Array<Array<number>>, meteorBoundsTrace: Array<{distance: number, min: number, max: number}>}) {
  const screenWidthDistance = 10;
  const gridWidthDistance = 1;

  // get the gameAreaSize
  const gameAreaRef = useRef <HTMLDivElement | null> (null);

  const [gameAreaSize, setGameAreaSize] = useState({
    width: 1000,
    height: 800,
  });

  useEffect(() => {
    if( gameAreaRef.current !== null ){
      setGameAreaSize({
        width: gameAreaRef.current.offsetWidth,
        height: gameAreaRef.current.offsetHeight
      });
    }
  }, [gameAreaRef]);

  // functions to determine the position in the game area for distance and velocity
  const distanceToPixels = (d: number) => {
    return (d - meteorDistance + 0.5*screenWidthDistance)/screenWidthDistance * gameAreaSize.width;
  }
  const velocityToPixels = (v: number) => {
    return gameAreaSize.height - (v - workout.meteorVelocityMin) / (workout.meteorVelocityMax - workout.meteorVelocityMin) * gameAreaSize.height;
  }

  const gridDistance = Math.floor((meteorDistance - 0.5*screenWidthDistance) / gridWidthDistance) * gridWidthDistance
  const gridDistances = Array.from({length: 11}, (_, i) => i).map((x,i)=> gridDistance + i * gridWidthDistance)

  return (
    <div ref={gameAreaRef} style={{width: "100%", height: "100%", position: "relative"}}>

      {gridDistances.map(d => (
          <VerticalGrid key={d} x={distanceToPixels(d)}/>
      ))}

      <MeteorBounds meteorDistance={meteorDistance} distanceToPixels={distanceToPixels} velocityToPixels={velocityToPixels} meteorBoundsTrace={meteorBoundsTrace}/>

      <MeteorTrace meteorTrace={meteorTrace} instantaneousVelocity={instantaneousVelocity}  meteorDistance={meteorDistance} distanceToPixels={distanceToPixels} velocityToPixels={velocityToPixels}/>

    </div>
  );
}


function WorkoutOverviewGraph({workout, time}: {workout: MeteorWorkout, time: TimeDelta}) {
  const segmentHeight = (segment: MeteorWorkoutSegment): number => {
    return 50 - segment.intensityZone * 10
  }
  const totalWorkoutDuration = workout.totalDuration;

  const segmentLength = (segment: MeteorWorkoutSegment): number => {
    return segment.duration.timeDeltaMs / totalWorkoutDuration.timeDeltaMs * 1000 ;
  }
  const calculatePath = (workout: MeteorWorkout): string => {

    let d = "";
    let x1 = 0;
    for (var i = 0; i < workout.segments.length; i +=1) {
      if( i == 0 ) {
        d += " M"
      }
      else {
        d += " L"
      }
      let x2 = x1 + segmentLength(workout.segments[i]);
      let y = segmentHeight(workout.segments[i]);
      d += ` ${x1}, ${y} L ${x2}, ${y}`;
      x1 = x2;
    }
    return d;
  }

  return (
    <div style={{display: "flex", width: "100%"}}>
      <svg width="100%" viewBox="0 0 1000 50" xmlns="http://www.w3.org/2000/svg">
        <path id="OverviewGraph" stroke="rgba(var(--primary-text-rgb), 0.5)" strokeWidth="2px" strokeOpacity="1" fill="none"
           d={calculatePath(workout)} />
      </svg>
    </div>
  )
}


function SegmentIntervalStats({activeSegmentIndex, totalSegments, timeRemaining}: {activeSegmentIndex: number, totalSegments: number, timeRemaining: TimeDelta}){

  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}} className={styles.segmentStats}>
      <div className={styles.segmentNumber}>
        {activeSegmentIndex > -1 && (
          <span>{activeSegmentIndex + 1} / {totalSegments}</span>
        )}
      </div>

      <div className={styles.segmentTitle}>
        Interval
      </div>
      <div className={styles.segmentTimeRemaining}>
        {activeSegmentIndex > -1 && (
          timeRemaining.formatMinutesSeconds()
        )}
      </div>
    </div>
  );
}

const rower = getRower();

const workout = new MeteorWorkout(
  new MeteorWorkoutDef([
    new MeteorWorkoutDefSegment(new TimeDelta(5*1000), IntensityZone.Paddle),
    new MeteorWorkoutDefSegment(new TimeDelta(10*1000), IntensityZone.Steady),
    new MeteorWorkoutDefSegment(new TimeDelta(10*1000), IntensityZone.Race),
    new MeteorWorkoutDefSegment(new TimeDelta(5*1000), IntensityZone.Sprint),
    new MeteorWorkoutDefSegment(new TimeDelta(5*1000), IntensityZone.Paddle),
  ]),
  {
    [IntensityZone.Paddle]: 500 / 3.0 * 1000,
    [IntensityZone.Steady]: 500 / 3.5 * 1000,
    [IntensityZone.Race]: 500 / 4.0 * 1000,
    [IntensityZone.Sprint]: 500 / 4.5 * 1000
  }
);


export default function Page() {

  const dt = 40;

  const [meteorData, setMeteorData] = useState(workout.getInitialData());


  useEffect(() => {
    workout.start();
  }, []);

  // start the ui update loops
  useEffect(() => {
    const frameRefreshInterval = setInterval(() => {
      const t = new Date();

      const newMeteorData = workout.update(t, rower);
      setMeteorData(newMeteorData);
    }, dt);

    return () => {
      clearInterval(frameRefreshInterval);
    }
  }, []);


  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <div style={{display: "flex", height: "10em", flexDirection: "row"}}>
        <div style={{width: "15em"}}>
          left
        </div>
        <div style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
            <div>
              <WorkoutOverviewGraph workout={workout} time={meteorData.time}/>
            </div>
            <div>
              <SegmentIntervalStats activeSegmentIndex={meteorData.activeSegment.index} totalSegments={meteorData.totalSegments} timeRemaining={meteorData.activeSegment.timeRemaining} />
            </div>
        </div>
        <div style={{width: "15em"}}>
          right
        </div>
      </div>

      <div style={{width: "100%", flexGrow: 1, position: "relative"}}>
        <GameArea
            workout={workout}
            meteorDistance={meteorData.meteorDistance}
            instantaneousVelocity={meteorData.instantaneousVelocity}
            meteorTrace={meteorData.meteorTrace}
            meteorBoundsTrace={workout.meteorBoundsTrace}/>
      </div>
      <div style={{display: "flex", height: "10em"}}>
        Footer
      </div>

    </main>
  );
}
