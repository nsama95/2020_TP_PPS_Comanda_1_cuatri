import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from '../../servicios/database.service';
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

  constructor(
    private barcodeScanner : BarcodeScanner,
    private firestore : AngularFirestore,
    private bd : DatabaseService
  ) { }

  
  usuarioMesa = {
    mesa : "",
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
  
    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {
  
        if(doc.data().nombre == this.nombreAnonimo)
        {
          if(auxMesa == 101010)
          {
                this.usuarioMesa.nombreUsuario = doc.data().nombre;
                this.usuarioMesa.estadoMesa = "enEspera";
                this.usuarioMesa.perfilUsuario = doc.data().perfil;
                this.bd.crear('listaEspera', this.usuarioMesa);
          }
          
        }
  
          this.listaEspera = []; // esto pone la lista vacía para que quede facherisima.
        /*******MENSAJE* */
      })
  
    })
  
  
     }).catch(err => {
         console.log('Error', err);
     });
     
    }

}
