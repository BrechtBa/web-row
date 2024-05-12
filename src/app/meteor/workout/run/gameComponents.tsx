"use client"
import React, { useState, useEffect, useRef } from 'react';

import { MeteorWorkout, MeteorWorkoutSegment, MeteorWorkoutTarget } from './domain';

import styles from "./page.module.css";
import { range, TimeDelta } from '@/domain/intensityZone';


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
          <linearGradient id="Gradient1" x1="1" x2="0.6" y1="0" y2="0" className={styles.meteorTraceGradient}>
            <stop offset="0%" stopColor="var(--stop-color-0)"/>
            <stop offset="100%" stopColor="var(--stop-color-1)"/>
          </linearGradient>
          <radialGradient id="OrbRadialGradient" className={styles.meteorOrbHaloGradient}>
            <stop offset="0%" stopColor="var(--stop-color-0)"/>
            <stop offset="100%" stopColor="var(--stop-color-1)"/>
          </radialGradient>
        </defs>

        <circle cx={distanceToPixels(meteorDistance)} cy={velocityToPixels(instantaneousVelocity)} fill="url(#OrbRadialGradient)" className={styles.meteorOrbHalo} />

        <path stroke="url(#Gradient1)" fill="none" d={path} strokeLinecap="butt" className={styles.meteorTraceHalo}/>
        <path fill="none" d={path} className={styles.meteorTrace}/>

        <circle cx={distanceToPixels(meteorDistance)} cy={velocityToPixels(instantaneousVelocity)} className={styles.meteorOrb} />

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

function Target({distance, velocity, points, caught, distanceToPixels, velocityToPixels}: 
                {distance: number, velocity: number, points: number, caught: boolean, distanceToPixels: (d: number) => number, velocityToPixels: (c: number) => number}){

  return (
    <div style={{width: "100%", height: "100%", position: "absolute"}}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="radialGradient2" className={styles.targetHaloGradient}>
            <stop offset="0%" stopColor="var(--stop-color-0)"/>
            <stop offset="100%" stopColor="var(--stop-color-1)"/>
          </radialGradient>
        </defs>

          <circle cx={distanceToPixels(distance)} cy={velocityToPixels(velocity)} fill="url(#radialGradient2)" className={styles.targetHalo} />
          
          <circle cx={distanceToPixels(distance)} cy={velocityToPixels(velocity)} className={styles.targetCircle} />

          {!caught && (
            <text x={distanceToPixels(distance)} y={velocityToPixels(velocity)} className={styles.targetPoints}>+{points}</text>
          )}

      </svg>
    </div>
  );
}

export function GameArea({workout, meteorDistance, instantaneousVelocity, meteorTrace, meteorBoundsTrace, targets}: 
                         {workout: MeteorWorkout | null, meteorDistance: number, instantaneousVelocity: number, meteorTrace: Array<Array<number>>, 
                    meteorBoundsTrace: Array<{distance: number, min: number, max: number}>, targets: Array<MeteorWorkoutTarget>}) {
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
  }, [workout, gameAreaRef]);

  // functions to determine the position in the game area for distance and velocity
  const distanceToPixels = (d: number) => {
    return (d - meteorDistance + 0.5*screenWidthDistance)/screenWidthDistance * gameAreaSize.width;
  }
  const velocityToPixels = (v: number) => {
    if (workout === null){
      return gameAreaSize.height - (v - 1) / (4 - 1) * gameAreaSize.height;
    }
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

      {targets.filter(target => Math.abs(target.meteorDistance - meteorDistance) < 30).map(target => (
        <Target key={target.meteorDistance} distance={target.meteorDistance} velocity={target.meteorVelocity} points={target.points} caught={target.caught} distanceToPixels={distanceToPixels} velocityToPixels={velocityToPixels}/>
      ))}

      <MeteorTrace meteorTrace={meteorTrace} instantaneousVelocity={instantaneousVelocity}  meteorDistance={meteorDistance} distanceToPixels={distanceToPixels} velocityToPixels={velocityToPixels}/>

    </div>
  );
}


export function WorkoutOverviewGraph({workout, time}: {workout: MeteorWorkout, time: TimeDelta}) {
  const segmentHeight = (segment: MeteorWorkoutSegment): number => {
    return 50 - segment.intensityZone * 10
  }
  const totalWorkoutDuration = workout.totalDuration;

  const segmentLength = (duration: TimeDelta): number => {
    return duration.timeDeltaMs / totalWorkoutDuration.timeDeltaMs * 1000 ;
  }

  const calculatePath = (workout: MeteorWorkout, time?: TimeDelta): string => {

    let timeDeltaMs: number = 0
    let d: string = "";
    let x1: number = 0;
    for (var i = 0; i < workout.segments.length; i +=1) {
      if( i == 0 ) {
        d += " M"
      }
      else {
        d += " L"
      }

      let y = segmentHeight(workout.segments[i]);

      let x2 = x1 + segmentLength(workout.segments[i].duration);

      if(time === undefined || time.timeDeltaMs > timeDeltaMs + workout.segments[i].duration.timeDeltaMs){
        d += ` ${x1}, ${y} L ${x2}, ${y}`;
        timeDeltaMs += workout.segments[i].duration.timeDeltaMs;
      }
      else {
        x2 = x1 + segmentLength(new TimeDelta(time.timeDeltaMs - timeDeltaMs));
        d += ` ${x1}, ${y} L ${x2}, ${y}`;
        return d;
      }
      x1 = x2;
    }
    return d;
  }

  return (
    <div style={{display: "flex", width: "100%"}}>
      <svg width="100%" viewBox="0 0 1000 50" xmlns="http://www.w3.org/2000/svg">
        <path id="OverviewGraph" stroke="rgba(var(--primary-text-rgb), 0.5)" strokeWidth="2px" strokeOpacity="1" fill="none"
           d={calculatePath(workout)} />
        <path id="OverviewGraph" stroke="rgba(var(--important-rgb), 1.0)" strokeWidth="3px" strokeOpacity="1" fill="none"
           d={calculatePath(workout, time)} />
      </svg>
    </div>
  )
}

export function CurrentScore({score}: {score: number}) {

  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "left"}}>
       <div className={styles.title} style={{marginRight: "1em"}}>
        Current Score
       </div>
       <div className={styles.score}>
        {score}
       </div> 
    </div>
  );
}


export function HighScore({score}: {score: number}) {

  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "right"}}>
       <div className={styles.title} style={{marginRight: "1em"}}>
        High Score
       </div>
       <div className={styles.score}>
        {score}
       </div> 
    </div>
  );
}


export function SegmentIntervalStats({activeSegmentIndex, totalSegments, timeRemaining}: {activeSegmentIndex: number, totalSegments: number, timeRemaining: TimeDelta}){

  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
      <div className={styles.segmentNumber}>
        {activeSegmentIndex > -1 && (
          <span>{activeSegmentIndex + 1} / {totalSegments}</span>
        )}
      </div>

      <div className={styles.title} style={{marginLeft: "1em", marginRight: "1em"}}>
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

export function TimeRemaining({timeRemaining}: {timeRemaining: TimeDelta}) {


  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
      <div className={styles.title + " " + styles.segmentTitle} style={{textAlign: "right"}}>Remaining</div>
      <div className={styles.timeRemaining} style={{textAlign: "right"}}>{timeRemaining.formatMinutesSeconds()}</div>
    </div>
  )
}


export function TargetsCaught({targets}: {targets: number}) {

  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
      <div className={styles.title + " " + styles.segmentTitle} style={{textAlign: "left"}}>Targets</div>
      <div className={styles.timeRemaining} style={{textAlign: "left"}}>{targets}</div>
    </div>
  );
}

