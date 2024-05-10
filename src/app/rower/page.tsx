"use client"
import { useContext, useState } from "react";
import Link from "next/link";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { FloatingCloseButton } from "@/components/FloatingCloseButton";

import { RowerType } from '@/rower/factory';
import { RowerContext } from "@/app/contextProviders";


export default function Page() {

  const {rowerType, setRowerType} = useContext(RowerContext)

  return (
    <main style={{display: "flex", flexDirection: "column", height: "100%"}}>

      <h1>Rower config</h1>

      <div style={{padding: "1em"}}>

        <Select value={RowerType[rowerType]} label="Rower type" onChange={(e) => setRowerType(e.target.value as RowerType)} style={{width: "20em"}}>
          <MenuItem value={RowerType[RowerType.Tap]}>Tap Rower</MenuItem>
          <MenuItem value={RowerType[RowerType.WebsocketWaterrower]}>Websocket Waterrower</MenuItem>
        </Select>

        <Link href="/">
          <FloatingCloseButton />
        </Link>
      </div>
    </main>
  )
}