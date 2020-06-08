import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';


import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';
import { AuthService } from '../servicios/auth.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : string;
  listaUsuarios = [];

  constructor(private router : Router,
    private menu: MenuController,
    private firestore : AngularFirestore,
      private bd : DatabaseService,
      private auth : AuthService) {  }

    

  

  ngOnInit() {

    let auxUsuario = JSON.parse(localStorage.getItem("usuario"));
    
    this.perfilUsuario = auxUsuario.perfil;
    console.log(this.perfilUsuario);

    let fb = this.firestore.collection('usuarios');
   
    fb.valueChanges().subscribe(datos =>{
      this.listaUsuarios = [];
      datos.forEach( (dato:any) =>{

        if(dato.estado == 1)
        {

          this.listaUsuarios.push(dato);
        }
       
      });

    })
  }

  organizarUsuario(usuario,estado){

    let indice = this.listaUsuarios.indexOf(usuario); //me trae el indice especifico de ese usuario (array)
    this.listaUsuarios.splice(indice,1); //borra el objeto del array de ese usuario (array)

    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => { //obtenes la coleccion de la BASE DE DATOS de usuario
      querySnapShot.forEach((doc) => { //te muestra lo de adentro de cada uid

        
       if(doc.data().correo == usuario.correo) //compara lo que yo le paso con la BD
       {
         if(estado == 3) //compara el estado que le pase por paramentros
         {
          usuario.estado = estado;
          this.bd.actualizar('usuarios',usuario,doc.id);
         }
         else if(estado == 2){ 
          usuario.estado = estado;
          this.bd.actualizar('usuarios',usuario,doc.id);
          this.auth.registrarUsuario(usuario.correo,usuario.contrasenia); //lo registra
         }
       
        
         this.listaUsuarios = [];
       }

      })
    })
    
  }




  items = [
    {icono : "clipboard" , nombre : "menu" , ruta : "/menu"},
    
  ]
  jefeLogueado = {nombre : "Pablo" , apellido : "Hidalgo" , path : "../../../assets/mozo.png" , perfil : "Mozo"}

  cerrarSesion() {
    this.router.navigate(['/login']);
  }




  /*Cerrar()
  {
    this.router.navigate(['/login']);
  }*/

  // redireccionar(perfil)
  // {
  //   switch(perfil)
  //   {
  //     case 'supervisor' :  
  //     this.router.navigate(['/registrar-supervisor']);
  //       break;
  //     case 'empleado' : 
  //     this.router.navigate(['/registrar-empleado']);
  //     break;
  //     case 'cliente' : 
  //     this.router.navigate(['/registrar']);
  //     break;
  //     case 'atras' : 
  //     this.router.navigate(['/login']);
  //     break;
  //   }
     
  // }


  // openFirst() {
  //   this.menu.enable(true, 'first');
  //   this.menu.open('first');
  // }

  // openEnd() {
  //   this.menu.open('end');
  // }

  // openCustom() {
  //   this.menu.enable(true, 'custom');
  //   this.menu.open('custom');
  // }

  
  
}