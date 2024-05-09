import ClearIcon from '@mui/icons-material/Clear';


export function FloatingCloseButton({onClick}: {onClick?: (e?: object) => void}) {
 
  return (
    <div style={{position: "absolute", top: "1vw", right: "1vw"}}>
      <div onClick={onClick} style={{cursor: "pointer"}}>
        <ClearIcon sx={{fontSize: "5vw", color: "rgba(var(--secondary-text-rgb), 0.3)"}} />
      </div>
    </div>
  );
}