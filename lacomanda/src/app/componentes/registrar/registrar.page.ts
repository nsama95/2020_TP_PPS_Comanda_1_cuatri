import { Component, OnInit, Input } from '@angular/core';
import{DatabaseService } from "../../servicios/database.service"
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  
import { Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { from } from 'rxjs';
import{UsuarioBD} from "../../clases/usuario-bd";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
//import { IonicPage, NavController } from 'ionic-angular';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  dni : string;
  qr:any;
  pickedName :string;
  todo: FormGroup;
  clientes = [
    {perfil:"Cliente"},
    {perfil: "Anonimo"}]

    cliente = {
      foto:"../../../assets/img/avatarR.png",
    }


  constructor(
    private camera: Camera,
    public plataform:Platform,
    private barcodeScanner: BarcodeScanner,public fb: FormBuilder) {
      this.todo = this.fb.group({
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
        email: ['', [Validators.required, Validators.email]],
        dni: ['', [Validators.required]],
        contraseña: ['', [Validators.pattern(/^[a-z0-9_-]{6,18}$/)]],
      });
     
    }
  
    saveData(){
      alert(JSON.stringify(this.todo.value));
    }
    

  ngOnInit() {
    this.pickedName='Cliente';
  }


//funcion de foto
  options : CameraOptions = {
    quality: 40,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  tomarFoto()
  {
    this.camera.getPicture(this.options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cliente.foto = base64Image;
    }, (err) => {
      // Handle error
    });
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
