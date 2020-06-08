import { Component, OnInit, Input } from '@angular/core';
import{ DatabaseService } from "../../servicios/database.service";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';  
import { Platform } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { from } from 'rxjs';
import { UsuarioBD } from "../../clases/usuario-bd";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import * as firebase from 'firebase/app';
import {AngularFireStorage} from "@angular/fire/storage"
import { ComplementosService } from 'src/app/servicios/complementos.service';
//import { IonicPage, NavController } from 'ionic-angular';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  dni : string;
  qr:any;

  //list<UsuarioBD> ;
  pickedName :string;
  todo: FormGroup;
  clientes = [
    {perfil:"Cliente"},
    {perfil: "Anonimo"}]


    usuarioJson = 
      {nombre : "",
      apellido : "",
      dni : "",
      correo: "",
      contrasenia: "",
      foto:"../../../assets/img/avatarRR.png",
      tipo:"",
      estado:1
};

      anonimoJson = {
        nombre : "",
        contrasenia : "",
        correo : "",
      foto:"../../../assets/img/avatarRR.png",
      tipo:"",
      estado:1
    };

    pathImagen : string;

  constructor(
    private camera: Camera,
    public plataform:Platform,
    private bd : DatabaseService,
    private st : AngularFireStorage,
    private complemetos : ComplementosService,
    private barcodeScanner: BarcodeScanner,public fb: FormBuilder) {
      this.todo = this.fb.group({
        nombre: ['', [Validators.required,Validators.pattern('^[a-zA-Z]{3,10}$')]],
        apellido: ['', [Validators.required,, Validators.pattern('^[a-zA-Z]{3,10}$')]],
        email: ['', [Validators.required, Validators.email]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        contraseña: ['', [Validators.pattern('^[a-z0-9_-]{6,18}$')]],
      });
     
    }
  
    /*saveData(){
      alert(JSON.stringify(this.todo.value));
    }*/
    

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
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      var base64Str = 'data:image/jpeg;base64,'+imageData;
      this.usuarioJson.foto = base64Str;
      var storageRef = firebase.storage().ref();
     //obtenemos la foto que fue sacada en esen instante
      let obtenerLaFoto = new Date().getTime(); 
      var nombreFoto = "usuarios/"+obtenerLaFoto+"."+this.usuarioJson.dni+".jpg";
      var childRef = storageRef.child(nombreFoto);
      this.pathImagen = nombreFoto;
      childRef.putString(base64Str,'data_url').then(function(snapshot)
      {

      })

    },(Err)=>{
      alert(JSON.stringify(Err));
    })
    
  }

  registrarUsuario()
  {
    this.usuarioJson.estado= 1;
    this.usuarioJson.tipo="cliente";
    if(this.pathImagen != null){
      

      this.st.storage.ref(this.pathImagen).getDownloadURL().then((link) =>
      {

        this.usuarioJson.foto = link;
        this.bd.crear('usuarios',this.usuarioJson);

      });
    }
    else{
      this.bd.crear('usuarios',this.usuarioJson);
    }

    this.complemetos.presentToastConMensajeYColor("¡Solicitud enviada con exito! Espere su confirmación","primary");
    this.limpiar(this.usuarioJson.tipo);
  }

  registrarAnonimo()
  {
    this.anonimoJson.estado= 1;
    this.anonimoJson.tipo="anonimo";
    if(this.pathImagen != null){
      

      this.st.storage.ref(this.pathImagen).getDownloadURL().then((link) =>
      {

        this.anonimoJson.foto = link;
        this.bd.crear('usuarios',this.anonimoJson);

      });
    }
    else{
      this.bd.crear('usuarios',this.anonimoJson);
    }


    this.complemetos.presentToastConMensajeYColor("¡Solicitud enviada con exito! Espere su confirmación","primary");
    this.limpiar(this.anonimoJson.tipo);
  }

 

  escanearCodigo()
  {

    let texto;
  //lee el formato del dni que es pdf417
    this.barcodeScanner.scan({formats : "PDF_417"}).
    then(barcodeData => {
      


      texto = barcodeData.text.split("@");
      //alert('dni ' +texto + texto.length);
      if(texto.length==8|| texto.length == 9)
    {
      this.usuarioJson.nombre = texto[2];
       this.usuarioJson.apellido = texto[1];
      this.usuarioJson.dni=texto[4];//el 4 indica el 4to @
      this.complemetos.presentToastConMensajeYColor("¡Se cargaron con exito tus datos!","primary");
    }else if(texto.length == 17)
    {
     this.usuarioJson.nombre = texto[5];
     this.usuarioJson.apellido = texto[4];
     this.usuarioJson.dni = texto[1];
   }
   else if(texto.length == 14)
    {
     this.usuarioJson.nombre = texto[4];
     this.usuarioJson.apellido = texto[3];
     this.usuarioJson.dni = texto[7];
   }
    
  }).catch(err => {
    this.complemetos.presentToastConMensajeYColor("¡Hubo un error, intente más tarde!","primary");
      console.log('Error', err);
  });
      



  }
 
  pickUser(pickedName) {
    this.clientes.forEach((user) => {
      if (user.perfil === pickedName) {
        
        
      }
    });
  }
  limpiar(usuario:string){
    if(this.anonimoJson.tipo=="anonimo"){
    this.anonimoJson.nombre = "";
    this.anonimoJson.correo= "";
    this.anonimoJson.contrasenia= "";
    this.anonimoJson.foto="../../../assets/img/avatarRR.png";
    this.anonimoJson.tipo=""; 
     this.anonimoJson.estado=0;
  }else{
    this.usuarioJson.nombre = "";
    this.usuarioJson.apellido = "";
    this.usuarioJson.dni = "";
    this.usuarioJson.correo= "";
    this.usuarioJson.contrasenia= "";
    this.usuarioJson.foto="../../../assets/img/avatarRR.png";
    this.usuarioJson.tipo=""; 
     this.usuarioJson.estado=0;
  }
}
  /*checkEmptyInputs() {
    if (this.email && this.psw) {
      return false;
    } else {
      return true;
    }
  }*/
}
