"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import Grid from '@mui/material/Unstable_Grid2';

import styles from "./page.module.css";

import RootLayout from "./layout"


export default function Home() {
  
  const router = useRouter();

  return (
    <main style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <div style={{padding: "1em"}}>
        Top nav bar
      </div>

      <div style={{padding: "1em", flexGrow: 1}}>
        <Grid container spacing={2} style={{height: "100%"}}>
          <Grid>
            <div onClick={() => router.push("/meteor")} style={{backgroundColor: "rgba(212, 85, 0, 1)", height: "80%", width: "35vw", display: "flex", flexDirection: "column", cursor: "pointer", borderRadius: "10px"}}>
              <div style={{flexGrow: 1, padding: "2vw"}}>
              </div>

              <div style={{fontSize: "5vw", textTransform: "uppercase", padding: "2vw"}}>
                Meteor
              </div>
              
              <div style={{fontSize: "1.5vw", borderTop: "1px solid", borderColor: "rgba(var(--secondary-text-color), 1)", padding: "2vw", height: "10vw"}}>
                Collect tokens in structured intervals and beat the high score
              </div>
              
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{padding: "1em"}}>
        Progress bar
      </div>
    </main>
  );
}
