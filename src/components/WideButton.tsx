import React from 'react'


export function WideButton({onClick, children}: {onClick?: (e?: object) => void, children: React.ReactNode}) {
 
  const buttonStyle: object = {
    width: "100%",
    backgroundColor: "rgba(var(--primary-button-rgb), 1.0)",
    color: "rgba(var(--primary-text-rgb), 1.0)",
    fontSize: "2vw",
    textTransform: "uppercase",
    textAlign: "center",
    cursor: "pointer",
    padding: "3vw",
  }

  return (
    <div onClick={onClick} style={buttonStyle}>
      {children}
    </div>
  );
}