'use client'

import { IntensityZone } from "@/domain/intensityZone";
import { MenuItem, Select } from "@mui/material";

export function IntensityZoneSelect({intensityZone, setIntensityZone}: 
                                    {intensityZone: IntensityZone, setIntensityZone: (intensityZone: IntensityZone) => void}) {
  return (
    <Select value={IntensityZone[intensityZone]} label="Rower type" onChange={(e) => setIntensityZone(IntensityZone[e.target.value as keyof typeof IntensityZone])} style={{width: "20em"}}>
      <MenuItem value={IntensityZone[IntensityZone.Paddle]}>Paddle</MenuItem>
      <MenuItem value={IntensityZone[IntensityZone.Steady]}>Steady</MenuItem>
      <MenuItem value={IntensityZone[IntensityZone.Race]}>Race</MenuItem>
      <MenuItem value={IntensityZone[IntensityZone.Sprint]}>Sprint</MenuItem>
    </Select>
  );

}