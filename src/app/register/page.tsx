"use client"
import React, { useState, useEffect, useContext} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import TextField from "@mui/material/TextField";
import { WideButton, FloatingCloseButton } from "@/components/Buttons";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";
import getUserRepository from "../../factory";


const userRepository = getUserRepository();


export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [displayName, setDisplayName] = useState<string>("");

  const router = useRouter();
  
  const register = () => {
    userRepository.createUser(email, password, displayName).then(() => {
      console.log("success")
      router.push("/");
    });
  }


  return (
    <main style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      <div className="paper">
        <h1>Create account</h1>
        <div style={{display: "flex", flexDirection: "column", gap: "1em", margin: "1em", marginBottom: "2em"}}>
          <TextField label="e-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
          
          <TextField label="password"  value={password} onChange={(e) => setPassword(e.target.value)} 
            type={showPassword ? 'text' : 'password'}
            InputProps={{endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" style={{color: "rgba(var(--secondary-text-rgb), 1)"}}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )}}
          />

          <TextField label="User name" value={displayName} onChange={(e) => setDisplayName(e.target.value)}/>

        </div>
  
        <WideButton onClick={register}>
          Create account
        </WideButton>
        
      </div>

      <Link href="/login">
        <FloatingCloseButton/>
      </Link>
    </main>
  );
}