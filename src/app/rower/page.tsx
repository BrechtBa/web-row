"use client"
import { useContext, useState } from "react";
import Link from "next/link";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { CloseButton } from "@/components/Buttons";

import { RowerType } from '@/rower/factory';
import { RowerContext } from "@/app/contextProviders";
import { TitleBar } from "@/components/TitleBar";


export default function Page() {

  const {rowerType, setRowerType} = useContext(RowerContext)

  return (
    <main style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <TitleBar title="Rower configuration" icon={(<div>R</div>)}>
        <Link href="/">
          <CloseButton />
        </Link>
      </TitleBar>

      <div style={{padding: "1em"}}>

        <Select value={RowerType[rowerType]} label="Rower type" onChange={(e) => setRowerType(e.target.value as RowerType)} style={{width: "20em"}}>
          <MenuItem value={RowerType[RowerType.Tap]}>Tap Rower</MenuItem>
          <MenuItem value={RowerType[RowerType.WebsocketWaterrower]}>Websocket Waterrower</MenuItem>
        </Select>
        
      </div>
    </main>
  )
}