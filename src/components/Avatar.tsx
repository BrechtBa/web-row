import { default as MUIAvatar } from '@mui/material/Avatar';

import { User } from "@/domain/user";


function stringToColor(str: string): string {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}


export function Avatar({user, onClick}: {user: User, onClick?: (e?: object) => void}){

  return (
    <MUIAvatar onClick={onClick} sx={{bgcolor: stringToColor(user.displayName)}}>
      {user.displayName.slice(0, 1)}
    </MUIAvatar>
  );  
}