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


export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);

  const router = useRouter();
  
  const login = () => {
    userRepository.signInUser(email, password).then(() => {
      router.push("/");
    });
  }

  return (
    <main style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      <div className="paper">
        <h1>Login</h1>
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

        </div>
  
        <WideButton onClick={login}>
          Login
        </WideButton>
        
      </div>

      <div style={{margin: "2em", cursor: "pointer", color: "rgba(var(--clickable-rgb), 1)"}}>
        <Link href="/register">
          Create new account
        </Link>
      </div>

      <Link href="/">
        <FloatingCloseButton/>
      </Link>

    </main>
  );
}