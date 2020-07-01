import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from '../../servicios/database.service';
import { ComplementosService } from 'src/app/servicios/complementos.service';
@Component({
  selector: 'app-pedir-mesa',
  templateUrl: './pedir-mesa.page.html',
  styleUrls: ['./pedir-mesa.page.scss'],
})
export class PedirMesaPage implements OnInit {

  perfilUsuario : string;
  listaUsuarios = [];
  listaEspera = [];
  tieneCorreo: string;
  nombreAnonimo;
bandera=true;
  constructor(
    private complementos : ComplementosService,
    private barcodeScanner : BarcodeScanner,
    private firestore : AngularFirestore,
    private bd : DatabaseService
  ) { }

  
  usuarioMesa = {
    mesa : 0,
    estadoMesa : "",
    nombreUsuario: "",
    perfilUsuario : "",
  }

  ngOnInit() {
    let nombreAnonimo = localStorage.getItem('nombreAnonimo');
    this.nombreAnonimo = localStorage.getItem('nombreAnonimo');
  }


  listaEsperaQR()
  {
    let auxMesa;
  
    this.barcodeScanner.scan().then(barcodeData => {
  
    auxMesa = JSON.parse(barcodeData.text);
  let bandera=false;
    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {
  
        if(doc.data().nombre == this.nombreAnonimo)
        {
          if(auxMesa == 0)
          {
            
            this.firestore.collection('listaEspera').get().subscribe((querySnapShot) => {
              querySnapShot.forEach((data) => {
               
                if(data.data().nombreUsuario== this.nombreAnonimo)
                {
                  this.complementos.presentToastConMensajeYColor('Ya estas en la lista de espera',"warning");
                  this.bandera=false;
                  return;
                } 
                
               
              })})
             if(bandera != false){
                  
                this.usuarioMesa.nombreUsuario = doc.data().nombre;
            this.usuarioMesa.estadoMesa = "enEspera";
            this.usuarioMesa.perfilUsuario = doc.data().perfil;
            this.bd.crear('listaEspera', this.usuarioMesa);
            this.complementos.presentToastConMensajeYColor('Estas en la lista de espera',"medium");
                
              }
            
                
          }
          else{
            this.complementos.presentToastConMensajeYColor('Error! QR incorrecto, este QR no corresponde al qr de la entrada',"warning");
          }

          



        
          
        }



  
          this.listaEspera = []; 
      })
  
    })
  
  
     }).catch(err => {
         console.log('Error', err);
         this.complementos.presentToastConMensajeYColor('Error al usar el Qr scanner',"warning");
     });
     
    }

}
