import { Component, OnInit, Input } from '@angular/core';
//import{ComplementosService } from "../../servicios/complementos.service"
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  
import { Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  dni : string;
  qr:any;
  pickedName :string;
  clientes = [
    {perfil:"Cliente"},
    {perfil: "Anonimo"}
  ]
  constructor(
    private camera: Camera,
    public plataform:Platform,
    private barcodeScanner: BarcodeScanner
  ) { 
    
    
   
  }

  ngOnInit() {
    this.pickedName='Cliente';
  }

  escanearCodigo()
  {

    let fafafa;

    this.barcodeScanner.scan().then(barcodeData => {
      alert('Barcode data: ' + barcodeData);


      fafafa = JSON.parse(barcodeData.text);

      this.dni = fafafa;

     }).catch(err => {
         console.log('Error', err);
     });

  }
 
  pickUser(pickedName) {
    this.clientes.forEach((user) => {
      if (user.perfil === pickedName) {
        
        
      }
    });
  }
}
