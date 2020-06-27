import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';


import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';
import { AuthService } from '../servicios/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : string;
  listaUsuarios = [];
  listaEspera = [];
  tieneCorreo: string;
  nombreAnonimo;
  loading = true;
  correoCliente ;
  jsonEncuesta ={
    preguntaUno: 0,
    preguntaDos: 0,
    fotos : [],
  }
  gradoSatisfaccion ;
  gradoSatisfaccionRes;
    // Mensaje avisando al cliente  su asignacion de mesa
    informarEstadoMesa ={
      mesa: "",
      seAsignoMesa : "no",
    };
    mostrarEncuestaBoton = false;

    mostrarCuentaDiv = false;
    mostrarEncuestaDiv = false;
  
   
  constructor(private router : Router,
    private barcodeScanner : BarcodeScanner,
    private menu: MenuController,
    private firestore : AngularFirestore,
      private bd : DatabaseService,
      private auth : AuthService,
      
      ) {  }
listarConsulta=[];
mostrarConsulta= false;
      usuarioMesa = {
        mesa : "",
        estadoMesa : "",
        nombreUsuario: "",
        apellidoUsuario: "",
        perfilUsuario : "",
      }
      cantConsulta=0;
      mostrarEstadoPedido=false;
      infoUsuario : any;
    nombre:string;
    correoUsuario : string;
    cantPedido=0;
    cantPedidoListo=0;
    listaPedido=[];
  listaPedidoListo=[];
     // Variable que nos mostrara los productos una vez escaneado el codigo qr
  mostrarProductos : boolean = true;

  // Lista de los productos que se mostraran
 //listaProductos = [];

      ngOnInit() {

        let fb = this.firestore.collection('pedidos');
   
        fb.valueChanges().subscribe(datos =>{      
          
          this.listaPedido = [];
          this.listaPedidoListo = [];
    
          datos.forEach( (dato:any) =>{
    
            if(dato.estado === 'pendiente') 
            {
              this.listaPedido.push(dato);     
            }
/*if(dato.estado=='enProceso'){
  
}*/
            if(dato.estado  == 'enProceso' && dato.estadoChef == 'listo' && dato.estadoBartender == 'listo') 
            {
              this.listaPedidoListo.push(dato);     
            }
            
          });
          this.cantPedido=this.listaPedido.length;
          this.cantPedidoListo=this.listaPedidoListo.length;
        })
        
        //console.log(this.cantPedido)
        //this.cantPedidoListo=this.listaPedidoListo.length;




        this.firestore.collection('consultas').get().subscribe((querySnapShot) => {
    
          querySnapShot.forEach(dato => {
      
            if(dato.data().estado == 'pendiente')
            {
             this.listarConsulta.push(dato);
            }
      
          })
          this.cantConsulta=this.listarConsulta.length;
        
        });
  
           let auxCorreoUsuario = localStorage.getItem('correoUsuario'); // Obtenemos el correo del usuario que ingreso 
          
           this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
    
            querySnapShot.forEach(datos => {
      
              if(datos.data().correo == auxCorreoUsuario )
              {
                this.perfilUsuario = datos.data().perfil;
               
                this.nombre= datos.data().nombre;
                localStorage.setItem('nombreAnonimo',this.nombre);
                this.infoUsuario = datos.data();
        
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
                else if (this.perfilUsuario == 'metre')
                {
                  let fb = this.firestore.collection('listaEspera');
                  
          
                // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
                fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
                  
                  this.listaEspera = [];//***************
          
                  datos.forEach( (dato:any) =>{
          
                    if(dato.estadoMesa == 'enEspera') // Verifico que el estado sea esperando.
                    {
                      this.listaEspera.push(dato);      // <--- LISTA DE USUARIOS.
                    }
                    
                  });
          
                   })
                
                }

               //Si el perfil del usuario que ingreso es un cliente, comprobara el estado de lista de espera
            else if (this.perfilUsuario == 'cliente' ||this.perfilUsuario =='anonimo' )
            {
              // Obtenemos el correo del usuario que 
              this.correoCliente = this.correoUsuario ;
              let fb = this.firestore.collection('listaEspera');
          
              fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
              
              this.listaEspera = [];
      
              datos.forEach( (datoCl:any) =>{
                
                // Si el estado de la mesa esta asignada y coincide la informacion del usuario que inicio sesion, se guardara en un json el numero de mesa que se le asigno uy una bandera
                if(datoCl.estadoMesa == 'mesaAsignada' && datoCl.nombreUsuario == this.infoUsuario.nombre) 
                {
                  this.informarEstadoMesa.mesa = datoCl.mesa;
                  this.informarEstadoMesa.seAsignoMesa = "si";
                  localStorage.setItem('mesaCliente',this.informarEstadoMesa.mesa);

                }
                
                });
      
               })

            }
          
          }
        })
  
      })
    
    
          setTimeout(() => {
            this.loading = false;
          }, 3000);
    
        
    
       
      }        

      realizoPedido(mesa){


        let fb = this.firestore.collection('pedidos');
   
        fb.valueChanges().subscribe(datos =>{      
          
          this.listaPedido = [];
          this.listaPedidoListo = [];
    
          datos.forEach( (dato:any) =>{
    
if(dato.estado=='enProceso' && dato.mesa==mesa){
  this.mostrarEstadoPedido=true;
}

          });
      
        })
        

      }






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


  cerrarSesion() {
    this.perfilUsuario = "";
    this.router.navigate(['/login']);
    
  }

  
  listaEsperaQRCliente()
  {
    let auxMesa;

    this.barcodeScanner.scan().then(barcodeData => {

    auxMesa = JSON.parse(barcodeData.text);

    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        if(doc.data().correo == this.correoCliente)
        {
          if(auxMesa == 101010)
          {
                this.usuarioMesa.nombreUsuario = doc.data().nombre;
                this.usuarioMesa.apellidoUsuario = doc.data().apellido;
                this.usuarioMesa.estadoMesa = "enEspera";
                this.usuarioMesa.perfilUsuario = doc.data().perfil;
                
          }
          this.bd.crear('listaEspera', this.usuarioMesa);
        }

          this.listaEspera = []; 

      })

    })

     }).catch(err => {
         console.log('Error', err);
     });
     
  }


   
  comprobarMesas(mesa)
  {
    localStorage.setItem('usuarioMesa',JSON.stringify(mesa));
    this.router.navigate(['/lista-mesas']);
  }


qrMesa()
{
  let auxMesa;

  this.barcodeScanner.scan().then(barcodeData => {

  auxMesa = JSON.parse(barcodeData.text);

  this.firestore.collection('listaMesas').get().subscribe((querySnapShot) => {
    querySnapShot.forEach((doc) => {

      if(doc.data().numero == auxMesa) 
      {
        this.mostrarProductos = true;
      }

    })

  })

   }).catch(err => {
       console.log('Error', err);
   });
}

mostrarConsultas(){

this.mostrarConsulta= true;
}
consultarMozo()
{
  let auxConsulta ;

 
    
}
enviarEncuesta()
{
  this.jsonEncuesta.preguntaUno=this.gradoSatisfaccion;
  this.jsonEncuesta.preguntaDos=this.gradoSatisfaccionRes;
   this.bd.crear('encuestas',this.jsonEncuesta);
} 

mostrarEncuestaLista()
{
  this.mostrarCuentaDiv = false;
  this.mostrarEncuestaDiv = true;
 
}

mostrarCuentaLista()
{
  this.mostrarCuentaDiv = true;
  this.mostrarEncuestaDiv = false;
  
}
  
}