import { Injectable } from '@angular/core';

// PRIMERO IMPORTO EL EL ANGULAR FIRE AUTH.
import { AngularFireAuth } from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFauth : AngularFireAuth) { }


login(email : string, password : string){

  return new Promise((resolve, rejected) => {

  this.AFauth.signInWithEmailAndPassword(email, password)
  
  .then (user => resolve(user))
  
  .catch(err => rejected(err))

  });
  


}


}



/* 
this.AFauth.signInWithEmailAndPassword(email, password).then 
  (res => {console.log(res)}).catch(err => console.log("ERROR!: " + err))*/