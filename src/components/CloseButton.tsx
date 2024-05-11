import ClearIcon from '@mui/icons-material/Clear';


export function CloseButton({onClick}: {onClick?: (e?: object) => void}) {
 
  return (
    <div onClick={onClick} style={{cursor: "pointer", height: "100%"}}>
      <ClearIcon sx={{height: "100%", width: "auto", color: "rgba(var(--secondary-text-rgb), 0.6)"}} />
    </div>
  );
}

export function FloatingCloseButton({onClick}: {onClick?: (e?: object) => void}) {
 
  return (
    <div style={{position: "absolute", top: "1vw", right: "1vw"}}>
      <CloseButton onClick={onClick}/>
    </div>
  );
}