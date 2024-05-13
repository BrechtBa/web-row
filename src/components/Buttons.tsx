import ClearIcon from '@mui/icons-material/Clear';
import PauseIcon from '@mui/icons-material/Pause';
import React from "react";


export function CloseButton({onClick}: {onClick?: (e?: object) => void}) {
 
  return (
    <div onClick={onClick} style={{cursor: "pointer", height: "100%"}}>
      <ClearIcon sx={{height: "100%", width: "auto", color: "rgba(var(--secondary-text-rgb), 0.6)"}} />
    </div>
  );
}


export function FloatingCloseButton({onClick}: {onClick?: (e?: object) => void}) {
 
  return (
    <div style={{position: "absolute", top: "1vw", right: "1vw", width: "3em", height: "3em"}}>
      <CloseButton onClick={onClick} />
    </div>
  );
}


export function PauseButton({onClick}: {onClick?: (e?: object) => void}) {
 
  return (
    <div onClick={onClick} style={{cursor: "pointer", height: "100%"}}>
      <PauseIcon sx={{height: "100%", width: "auto", color: "rgba(var(--secondary-text-rgb), 0.6)"}} />
    </div>
  );
}


export function WideButton({ onClick, children }: { onClick?: (e?: object) => void; children: React.ReactNode; }) {

  const buttonStyle: object = {
    width: "100%",
    backgroundColor: "rgba(var(--primary-button-rgb), 1.0)",
    color: "rgba(var(--primary-text-rgb), 1.0)",
    fontSize: "2vw",
    textTransform: "uppercase",
    textAlign: "center",
    cursor: "pointer",
    padding: "3vw",
  };

  return (
    <div onClick={onClick} style={buttonStyle}>
      {children}
    </div>
  );
}
