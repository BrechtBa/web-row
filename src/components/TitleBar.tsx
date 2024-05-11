import React from 'react';



export function TitleBar({title, icon, children}: {title: string, icon: React.ReactNode, children: React.ReactNode}){

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <div style={{marginLeft: "1em", marginRight: "1em", padding: "0.5em"}}>
        {icon}
      </div>
      <div style={{flexGrow: 1, fontSize: "2em", textTransform: "uppercase", padding: "0.5em"}}>
        {title}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}