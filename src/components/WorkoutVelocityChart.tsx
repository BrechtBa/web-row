import { TimeDelta } from "@/domain/intensityZone";
import { WorkoutVelocityHistory } from "@/domain/workoutExecution";


function calculatePath(data: number[][], k?: number) {
  if (k == null) k = 1.0;

  var size = data.length;

  var path = "M" + [data[0][0], data[0][1]];

  for (var i = 1; i < size; i +=1) {

    var x = data[i][0];
    var y = data[i][1];

    path += "L" + [x, y];
  }
  return path;
}


export function WorkoutVelocityChart({velocityHistory, intervalTimes}: {velocityHistory: WorkoutVelocityHistory, intervalTimes: Array<TimeDelta>}) {
  let vMax = 7;

  const velocity2y = (velocity: number): number => {
    return 200 - velocity / vMax * 200;
  }

  const timeDelta2x = (duration: TimeDelta): number => {
    return duration.timeDeltaMs / velocityHistory[velocityHistory.length-1].time.timeDeltaMs * 1000 ;
  }

  return (
    <div style={{marginBottom: "-4px"}}>
      <svg width="100%" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">

        <path id="fill" stroke="none" strokeWidth="0" strokeOpacity="1" fill="rgba(var(--important-rgb), 0.2)"
           d={calculatePath(velocityHistory.map((v) => [timeDelta2x(v.time), velocity2y(v.velocity)])) + "L 1000, 200 L 0, 200 Z"} />
            
        <path id="OverviewGraph" stroke="rgba(var(--important-rgb), 1)" strokeWidth="2px" strokeOpacity="1" fill="none"
           d={calculatePath(velocityHistory.map((v) => [timeDelta2x(v.time), velocity2y(v.velocity)]))} />

        {intervalTimes.map(time => (
          <path id="OverviewGraph" stroke="rgba(var(--secondary-text-rgb), 1)" strokeWidth="1px" strokeOpacity="1" fill="none"
            d={`M ${timeDelta2x(time)}, 3 L ${timeDelta2x(time)}, 197`} />
        ))}

      </svg>
    </div>
  )
}