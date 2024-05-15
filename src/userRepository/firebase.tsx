import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, Firestore, collection, getDoc, doc, setDoc, updateDoc, query, getDocs, where  } from 'firebase/firestore/lite';

import { app } from "@/firebase"

import { User, guestUser, initialIntensityZoneSplits, initialRank, Rank } from "@/domain/user"
import { UserRepository } from "./interface";
import { IntensityZoneSplits } from "@/domain/intensityZone";



interface UserObject {
  userId: string;
  displayName: string;
  intensityZoneSplits: IntensityZoneSplits;
  rank: number;
  uid?: string;
}


export class FirebaseUserRepository implements UserRepository {
  auth: Auth;
  firestore: Firestore;

  constructor(){
    this.auth = getAuth(app);
    this.firestore = getFirestore(app);

    onAuthStateChanged(this.auth, (firebaseUser) => {

    });
  }

  onUserSignedInChanged(signedInCallback: (user: User) => void): void {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if(firebaseUser) {

        this.getUserByUid(firebaseUser.uid).then((user: User | undefined) => {
          if(user){
            signedInCallback(user);
          }
        });
      }
    });
  }

  async createUser(email: string, password: string, displayName: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = User.create(displayName, initialIntensityZoneSplits, initialRank);

    await setDoc(doc(this.firestore, "userInfo", user.userId), {
      ...this.userToObject(user),
      uid: userCredential.user.uid
    });

    this.storeLocalUser(user);
    
    return new Promise((resolve) => resolve(user))
  }


  async signInUser(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = await this.getUserByUid(userCredential.user.uid);
    

    if(user === undefined){
      return Promise.reject();
    }
    this.storeLocalUser(user);

    return new Promise<User>((resolve) => {
      resolve(user);
    });
  }


  async updateUserInfo(user: User): Promise<boolean> {
    await updateDoc(doc(this.firestore, "userInfo", user.userId), {
      ...this.userToObject(user)
    });
    return new Promise<boolean>((resolve) => resolve(true));
  }


  async getUserByUserId(userId: string): Promise<User> {
    const docSnap = await getDoc(doc(this.firestore, "userInfo", userId))
    if (!docSnap.exists()) {
      return Promise.reject();
    }
    return new Promise((resolve) => {
      return resolve(this.objectToUser(docSnap.data() as UserObject));
    });
  }


  async listLocalUsers(): Promise<Array<User>> {
    const localUsersString = localStorage.getItem("localUsers");

    const localUsers = localUsersString === null ? [] : Object.values(JSON.parse(localUsersString)).map((val) => {
      return this.objectToUser(val as UserObject);
    })
    localUsers.push(guestUser);

    return  new Promise((resolve) => {resolve(localUsers)})
  }

  private storeLocalUser(user: User): void {
    const localUsersObjects = localStorage.getItem("localUsers");

    if(localUsersObjects === null) {
      localStorage.setItem("localUsers", JSON.stringify({[user.userId]: this.userToObject(user)}));
    }
    else {
      localStorage.setItem("localUsers", JSON.stringify({
        ...JSON.parse(localUsersObjects), 
        [user.userId]: this.userToObject(user)
      }));
    }
    
  }

  private async getUserByUid(uid: string): Promise<User | undefined> {
    const q = query(collection(this.firestore, "userInfo"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
      return new Promise((resolve) => resolve(undefined))
    }
    const doc = querySnapshot.docs[0];
    return new Promise((resolve) => resolve(this.objectToUser(doc.data() as UserObject)))
  }

  private userToObject(user: User): UserObject {
    return {
      userId: user.userId,
      displayName: user.displayName,
      intensityZoneSplits: user.intensityZoneSplits,
      rank: user.rank,
    }
  }

  private objectToUser(user: UserObject): User {
    return new User(
      user.userId, 
      user.displayName, 
      user.intensityZoneSplits !== undefined ? user.intensityZoneSplits : initialIntensityZoneSplits, 
      user.rank !== undefined ? user.rank as Rank: initialRank)
  }
 
}
