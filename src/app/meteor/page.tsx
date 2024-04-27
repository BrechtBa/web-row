"use client"
import React, { useState, useEffect, useRef } from "react";

import getRower from '../../rower/factory.tsx'

import styles from "./page.module.css";


function calculateSmoothPath(data, k) {
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



function Trace({y, yHistory, d, distanceToPixels, velocityToPixels}) {
  const ORB_RADIUS = 20;

  if(yHistory[yHistory.length-1][0] < d - 0.1){
    yHistory.push([d, y]);
  }

  const path = calculateSmoothPath(yHistory.map(p => [distanceToPixels(p[0], d), velocityToPixels(p[1])]));

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

        <circle r={2*ORB_RADIUS} cx={distanceToPixels(d, d)} cy={velocityToPixels(y)} fill="url(#OrbRadialGradient)" />

        <path stroke="url(#Gradient1)" strokeWidth={2*ORB_RADIUS} fill="none" d={path} strokeLinecap="butt" />
        <path stroke="rgba(var(--important-rgb), 1)" strokeWidth="3" fill="none" d={path} />

        <circle r={ORB_RADIUS} cx={distanceToPixels(d, d)} cy={velocityToPixels(y)} fill="rgba(var(--foreground-rgb), 1)" />

      </svg>
    </div>
  )
}


function VerticalGrid({x}) {
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


function GameArea({distance, instantaneousVelocity, instantaneousVelocityTrace}) {
  const screenWidthDistance = 20;
  const gridWidthDistance = 2;
  const vMin = 0.5;
  const vMax = 5;

  // get the gameAreaSize
  const gameAreaRef = useRef();
  const [gameAreaSize, setGameAreaSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.77,
  });
  useEffect(() => {
    setGameAreaSize({
      width: gameAreaRef.current.offsetWidth,
      height: gameAreaRef.current.offsetHeight
    });
  }, [gameAreaRef]);

  // functions to determine the position in the game area for distance and velocity
  const distanceToPixels = (d, d0) => {
    return (d - d0 + 0.5*screenWidthDistance)/screenWidthDistance * gameAreaSize.width;
  }
  const velocityToPixels = (v) => {
    return gameAreaSize.height - (v - vMin) / (vMax - vMin) * gameAreaSize.height;
  }

  const gridDistance = parseInt((distance - 0.5*screenWidthDistance) / gridWidthDistance) * gridWidthDistance
  const gridDistances = Array(11).fill().map((x,i)=> gridDistance + i * gridWidthDistance)
  const scale = 200;

  return (
    <div ref={gameAreaRef} style={{width: "100%", height: "100%", position: "relative"}}>

      {gridDistances.map(d => (
          <VerticalGrid key={d} x={distanceToPixels(d, distance)}/>
      ))}

      <Trace yHistory={instantaneousVelocityTrace} y={instantaneousVelocity}  d={distance} distanceToPixels={distanceToPixels} velocityToPixels={velocityToPixels}/>

    </div>
  );
}


const rower = getRower();


export default function Page() {

  const dt = 40;

  const [instantaneousVelocity, setInstantaneousVelocity] = useState(0);
  const [instantaneousVelocityTrace, setInstantaneousVelocityTrace] = useState([[0, 0]]);

  const [distance, setDistance] = useState(0);

  const velocity = 6;

  // start the ui update loops
  useEffect(() => {
    const t0 = new Date().getTime();

    const fastInterval = setInterval(() => {
      const t = new Date().getTime();
      const distanceNew = (t-t0)*velocity/1000;

      setInstantaneousVelocity(rower.getInstantaneousVelocity());
      setDistance(distanceNew);
    }, dt);

    const traceInterval = setInterval(() => {
      const t = new Date().getTime();
      const distanceNew = (t-t0)*velocity/1000;

      instantaneousVelocityTrace.push([distanceNew, rower.getInstantaneousVelocity()]);

      setInstantaneousVelocityTrace(instantaneousVelocityTrace.slice(-20));
    }, 200);

    return () => {
      clearInterval(fastInterval); clearInterval(traceInterval);
    }
  }, []);


  return (
    <main style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <div style={{display: "flex", flexGrow: 0.1}}>
        Header
      </div>
      <div style={{width: "100%", flexGrow: 0.75, position: "relative"}}>
        <GameArea distance={distance} instantaneousVelocity={instantaneousVelocity} instantaneousVelocityTrace={instantaneousVelocityTrace}/>
      </div>
      <div style={{display: "flex", flexGrow: 0.15}}>
        Footer
      </div>

    </main>
  );
}
