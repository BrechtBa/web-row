"use client"
import React, { useState, useEffect} from "react";
import Link from "next/link";

import Grid from '@mui/material/Unstable_Grid2';

import styles from "./page.module.css";

import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';

export default function Home() {
  
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main style={{height: "100%"}}>
      <Drawer className={styles.menu} anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Link href="/rower">
          <div className={styles.menuItem}>
            Rower configuration
          </div>
        </Link>
        
        <div style={{minWidth: "15em"}}>
        </div>
      </Drawer>

      <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
        <div style={{padding: "1em", display: "flex", flexDirection: "row"}}>
          <div style={{flexGrow: 1}}>
            <MenuIcon onClick={() => setMenuOpen(true)}/>
            Other nav icons
          </div>
          <div>
            User
          </div>
        </div>

        <div style={{padding: "1em", flexGrow: 1}}>
          <Grid container spacing={2} style={{height: "100%"}}>
            <Grid>
              <Link href="/meteor">
                <div style={{backgroundColor: "rgba(212, 85, 0, 1)", height: "100%", width: "35vw", display: "flex", flexDirection: "column", cursor: "pointer", borderRadius: "10px"}}>
                  <div style={{flexGrow: 1, padding: "2vw"}}>
                  </div>

                  <div style={{fontSize: "5vw", textTransform: "uppercase", padding: "2vw"}}>
                    Meteor
                  </div>
                  
                  <div style={{fontSize: "1.5vw", borderTop: "1px solid", borderColor: "rgba(var(--secondary-text-color), 1)", padding: "2vw", height: "10vw"}}>
                    Collect tokens in structured intervals and beat the high score
                  </div>
                </div>
              </Link>
            </Grid>
          </Grid>
        </div>
        <div style={{padding: "1em"}}>
          Bottom bar
        </div>
      </div>

    </main>
  );
}
