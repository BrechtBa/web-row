"use client"
import React, { useState, useEffect, useContext} from "react";
import Link from "next/link";

import Grid from '@mui/material/Unstable_Grid2';

import styles from "./page.module.css";

import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import { Avatar } from "@/components/Avatar";
import { UserContext } from "./contextProviders";
import { WideButton } from "@/components/Buttons";
import { User, guestUser } from "@/domain/user";
import getUserRepository from "@/userRepository/factory";


const userRepository = getUserRepository();


export default function Home() {
  
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [localUsers, setLocalUsers] = useState<Array<User>>([guestUser]);

  const {user, setUser} = useContext(UserContext);


  useEffect(() => {
    userRepository.listLocalUsers().then((users) => {
      setLocalUsers(users)
    });
  }, [userRepository]);

  return (
    <main style={{height: "100%"}}>
      <Drawer className={styles.menu} anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div style={{minWidth: "15em", height: "100%", display: "flex", flexDirection: "column"}}>
          <Link href="/rower">
            <div className={styles.menuItem}>
              Rower configuration
            </div>
          </Link>
        </div>
      </Drawer>

      <Drawer className={styles.menu} anchor="right" open={userMenuOpen} onClose={() => setUserMenuOpen(false)}>
        <div style={{minWidth: "15em", height: "100%", display: "flex", flexDirection: "column"}}>
          
          {user.userId !== guestUser.userId && (
            <Link href="/user">
              <div className={styles.menuItem}>
                Profile
              </div>
            </Link>
          )}
          
          <div style={{flexGrow: 1, padding: "1em", display: "flex", flexDirection: "column", gap: "1em"}}>
            {localUsers.map((localUser) => (
              <div key={localUser.userId} style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "1em"}} onClick={() => {setUser(localUser); setUserMenuOpen(false);}}>
                <Avatar user={localUser} />
                <div>{localUser.displayName}</div>
              </div>
            ))}

          </div>

          <Link href="/login">
            <WideButton>
              New user
            </WideButton>
          </Link>
        </div>
      </Drawer>

      <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
        <div style={{padding: "1em", display: "flex", flexDirection: "row"}}>
          <div style={{height: "100%"}}>
            <MenuIcon onClick={() => setMenuOpen(true)} style={{height: "100%", width: "auto"}}/>
          </div>
          <div style={{flexGrow: 1}}>
          </div>
          <div style={{height: "100%"}}>
            <Avatar user={user} onClick={() => setUserMenuOpen(true)} />
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
