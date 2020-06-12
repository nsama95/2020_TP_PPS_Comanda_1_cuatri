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
  tieneCorreo: string;

  constructor(private router : Router,
    private menu: MenuController,
    private firestore : AngularFirestore,
      private bd : DatabaseService,
      private auth : AuthService,
      
      ) {  }

    

    /*  ngOnInit() {

       // let auxUsuario = JSON.parse(localStorage.getItem("usuario"));
      //  this.perfilUsuario = auxUsuario.perfil;
        let auxCorreoUsuario = localStorage.getItem('correoUsuario');
        this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
    
          querySnapShot.forEach(datos => {
    
            if(datos.data().correo == auxCorreoUsuario )
            {
              this.perfilUsuario = datos.data().perfil;
              localStorage.setItem('perfil', JSON.parse(this.perfilUsuario));
          }
        })
      })*/
          
      ngOnInit() {

        this.tieneCorreo  = localStorage.getItem('tieneCorreo');
    
        if(this.tieneCorreo == 'conCorreo') // Si ingreso con correo, comprobara el perfil de la base de datos
        {
          
           let auxCorreoUsuario = localStorage.getItem('correoUsuario'); // Obtenemos el correo del usuario que ingreso 
           //this.perfilUsuario = this.bd.obtenerUsuariosBD('usuarios',auxCorreoUsuario); // Lo que obtenemos aca es el perfil del usuario 
           //console.log(this.perfilUsuario);
           this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
    
            querySnapShot.forEach(datos => {
      
              if(datos.data().correo == auxCorreoUsuario )
              {
                this.perfilUsuario = datos.data().perfil;
    
                if(this.perfilUsuario == 'dueño' || this.perfilUsuario == 'supervisor')
                {
                  // Voy a obtener la colección de usuarios y la guardo en FB.
                  console.log("Estoy aca dentro");
                let fb = this.firestore.collection('usuarios');
                  
          
                // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
                fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
                  
                  this.listaUsuarios = [];
          
                  datos.forEach( (dato:any) =>{
          
                    if(dato.estado == 1) // Verifico que el estado sea esperando.
                    {
                      this.listaUsuarios.push(dato);      // <--- LISTA DE USUARIOS.
                    }
                    
                  });
          
                })
                }
          
                // Si el perfil es metre le cargara la lista de espera
                else if (this.perfilUsuario == 'Metre')
                {
                  let fb = this.firestore.collection('listaEspera');
                  
          
                // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
                fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
                  
                  this.listaUsuarios = [];
          
                  datos.forEach( (dato:any) =>{
          
                    if(dato.estadoMesa == 'enEspera') // Verifico que el estado sea esperando.
                    {
                      this.listaUsuarios.push(dato);      // <--- LISTA DE USUARIOS.
                    }
                    
                  });
          
                   })
                
                }
              
              }
            })
      
          })
    
    
        
    
        }
        else // Si no ingreso con correo, automaticamente sabe que es un usuario anonimo
        {
          console.log("estoyDentroDelSinCorreo");
          let nombreAnonimo = localStorage.getItem('nombreAnonimo');
    
        }   
      }        



/*
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
          this.auth.mandarCorreoElectronico(usuario.correo);
         }
       
        
         this.listaUsuarios = [];
       }

      })
    })
    
  }
*/
organizarUsuario(usuario,estado){


  let indice = this.listaUsuarios.indexOf(usuario); // Encontrar el indice del usuario.

  this.listaUsuarios.splice(indice,1); // Borrar exclusivamente ese índice.
  // Esto borra de la LISTA, no de la base de datos.


  // A partir de acá empiezo a realizar cambios en la base de datos.

  // Obtengo la coleción y me suscribo a ella.
  this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
    querySnapShot.forEach((doc) => {

    
      // Correo de la BD == Correo de la lista.
     if(doc.data().correo == usuario.correo)
     {

      // Si lo rechaza.
       if(estado == "rechazado")
       {
        usuario.estado = estado;                        // El cliente pasa a estar rechazado.
        this.bd.actualizar('usuarios',usuario,doc.id);  // Actualiza el estado del cliente.
       }

       else{    // Estado aceptado.


        if (doc.data().perfil == "cliente")
        {
        usuario.estado = estado;                                          // El cliente pasa a estar aceptado.
        this.bd.actualizar('usuarios',usuario,doc.id);                    // Actualiza el estado del cliente.               
        this.auth.registrarUsuario(usuario.correo,usuario.contrasenia);   // Registra el usuario en la BD. Asi puede ingresar al login. Con el estado aceptado.
        this.auth.mandarCorreoElectronico(usuario.correo);                // Le envia un correo electrónico informado lo sucedido.
        }

        else
        {
          usuario.estado = estado;                                          // El cliente pasa a estar aceptado.
          this.bd.actualizar('usuarios',usuario,doc.id);                    // Actualiza el estado del cliente.              
        }

       }
      
       this.listaUsuarios = []; // esto pone la lista vacía para que quede facherisima.
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