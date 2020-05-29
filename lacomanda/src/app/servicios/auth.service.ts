import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';

// PRIMERO IMPORTO EL EL ANGULAR FIRE AUTH.
import { AngularFireAuth } from "@angular/fire/auth";
import { from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFauth : AngularFireAuth,
    private camera: Camera,
    private qr: QRScanner,
    ) { }


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