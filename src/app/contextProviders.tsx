"use client"
import { ReactNode, createContext, SetStateAction, Suspense, useState, useEffect } from 'react'

import { RowerType } from "@/rower/factory";
import { User, guestUser } from '@/domain/user';
import getUserRepository from '@/userRepository/factory';


export const RowerContext = createContext({rowerType: RowerType.Tap, setRowerType: (value: SetStateAction<RowerType>) => {}});
export const UserContext = createContext({user: guestUser, setUser: (value: SetStateAction<User>) => {}});

const userRepository = getUserRepository();


export default function ContextWrapper({children}: {children: ReactNode}) {

  const [rowerType, setRowerType] = useState<RowerType>(RowerType.Tap);
  const [user, setUser] = useState<User>(guestUser);

  useEffect(() => {
    userRepository.onUserSignedInChanged((user: User) => {
      setUser(user);
    });

  }, []);


  return (
    <div style={{width: "100%", height: "100%"}}>
      <Suspense>
        <RowerContext.Provider value={{rowerType: rowerType, setRowerType: setRowerType}}>
          <UserContext.Provider value={{user: user, setUser: setUser}}>
            {children}
          </UserContext.Provider>
        </RowerContext.Provider>
      </Suspense>
    </div>
  )
}