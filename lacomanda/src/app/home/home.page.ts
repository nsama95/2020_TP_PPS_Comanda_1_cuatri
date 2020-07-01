import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController, AlertController } from '@ionic/angular';


import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';
import { AuthService } from '../servicios/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ComplementosService } from '../servicios/complementos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mostrarP= false;
  menuMozo=true;
  mesaP;
  perfilUsuario : string;
  banderaMostrarCuentasPagadas = false;
  listaCuentasPagadas = [];
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
  mostrarSolicitudPago=false;
 solicitudPago=false;
  gradoSatisfaccion ;
  gradoSatisfaccionRes;
    // Mensaje avisando al cliente  su asignacion de mesa
    informarEstadoMesa ={
      mesa: '',
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
      public alertController: AlertController,
      private complementos : ComplementosService,
      
      ) {  }
listarConsulta=[];

mostrarConsulta= false;
      usuarioMesa = {
        mesa : 0,
        estadoMesa : "",
        nombreUsuario: "",
        apellidoUsuario: "",
        perfilUsuario : "",
      }
      pedidoPendiente=false;
      pedidoEnproceso=false;
      pedidoFinalizado=false;
      cantConsulta=0;
      mostrarEstadoPedido=false;
      infoUsuario : any;
    nombre:string;
    correoUsuario : string;
    cantPedido=0;
    cantPedidoPagadas=0;
    cantPedidoenProceso=0
    listaPedido=[];
  listaPedidoListo=[];
  listaPedidoenProceso = [];
     // Variable que nos mostrara los productos una vez escaneado el codigo qr
  mostrarProductos = false;
  mesa:string;
  banderaMesaAsignada= true;

  // Lista de los productos que se mostraran
 //listaProductos = [];

      ngOnInit() {
this.mesa='';
this.menuMozo=true;
        let fb = this.firestore.collection('pedidos');
   
        fb.valueChanges().subscribe(datos =>{      
          
          this.listaPedido = [];
          this.listaPedidoListo = [];
          this.listaPedidoenProceso = [];
    
          datos.forEach( (dato:any) =>{
    
            if(dato.estado === 'pendiente') 
            {
              this.listaPedido.push(dato);     
            }
/*if(dato.estado=='enProceso'){
  
}*/
            if(dato.estado  == 'enProceso' && dato.estadoChef == 'listo' && dato.estadoBartender == 'listo') 
            {
              this.listaPedidoenProceso.push(dato);     
            }
            if(dato.estado === 'pagado') 
            {
              this.listaCuentasPagadas.push(dato);     
            }
            
          });
          this.cantPedido=this.listaPedido.length;
          this.cantPedidoenProceso=this.listaPedidoenProceso.length;
          this.cantPedidoPagadas=this.listaCuentasPagadas.length;
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
                 this.mesa=this.informarEstadoMesa.mesa;
                 console.log()

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


qrMesaAsignada()
{
  let auxMesa;

  this.barcodeScanner.scan().then(barcodeData => {

  auxMesa = JSON.parse(barcodeData.text);

  this.firestore.collection('listaMesas').get().subscribe((querySnapShot) => {
    querySnapShot.forEach((doc) => {
      
      if(doc.data().mesa === auxMesa) 
      {
        this.mostrarProductos = true;
        this.complementos.presentToastConMensajeYColor('QR cargado con éxito!',"medium");
        this.banderaMesaAsignada=false;
       
      } 
       if(this.banderaMesaAsignada===true && doc.data().mesa != auxMesa){
        this.complementos.presentToastConMensajeYColor('Este no es el QR de tu mesa',"warning");
      }

    }
    )

  })

   }).catch(err => {
       console.log('Error', err);
       this.complementos.presentToastConMensajeYColor('Error al usar el Qr scanner',"warning");
   });
}

mostrarConsultas(){

this.mostrarConsulta= true;
}

enviarEncuesta()
{
  this.jsonEncuesta.preguntaUno=this.gradoSatisfaccion;
  this.jsonEncuesta.preguntaDos=this.gradoSatisfaccionRes;
   this.bd.crear('encuestas',this.jsonEncuesta);
} 

/*mostrarEncuestaLista()
{
  this.mostrarCuentaDiv = false;
  this.mostrarEncuestaDiv = true;
 
}

mostrarCuentaLista()
{
  this.mostrarCuentaDiv = true;
  this.mostrarEncuestaDiv = false;
  
}
*/



estadoPedido(){
  
  console.log("entra a la funcion");
  //console.log(mesaCliente);
  
    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      querySnapShot.forEach( async (dato:any) =>{
        console.log(dato.data().mesa)
      if(dato.data().estado === 'pendiente'&& dato.data().mesa===this.mesa ) 
      {
        this.pedidoPendiente=true;
        
        
    }
      if(dato.data().estado  == 'enProceso'&& dato.data().mesa===this.mesa) 
      {
        this.pedidoEnproceso=true;
    }
      if(dato.data().estado === 'listo' && dato.data().mesa===this.mesa) 
      {
        console.log('entre');
        this.pedidoFinalizado=true;
    }

    });
    
  })
  this.menu.close();

}
  

confirmarFinalizado(){
  this.pedidoFinalizado=false;
  this.mostrarSolicitudPago=true;
  
}
confirmarEnproceso(){
  this.pedidoEnproceso=false;
}confirmarPendiente(){
  this.pedidoPendiente=false;
}



darPropina()
{
  let auxiliar;
  this.barcodeScanner.scan().then(barcodeData => {

    auxiliar = JSON.parse(barcodeData.text);

      switch(auxiliar) // CAMBIAR ESTO SI NO FUNCIONA
      {
        case 4:
          this.propina = "Excelente -> 20%";
          this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.2 + this.jsonCuenta.precioTotal ;
        break ;
        case 3 :
          this.propina = "Muy bien -> 15%";
          this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.15 + this.jsonCuenta.precioTotal;
          break;
        case 2 : 
        this.propina = "Bien -> 10%";
        this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.1 + this.jsonCuenta.precioTotal;
        break;
        case 1 :
          this.propina = "Regular -> 5%";
          this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.05 + this.jsonCuenta.precioTotal;
          break;
          case 0 :
            this.propina = "Malo -> 0%";
          break;
      }
      
    }).catch(err => {
      console.log('Error', err);
})

}

propina;

jsonCuenta = {
  pedidos: [],
  propina: this.propina,
  precioTotal:0
}
mostrarCuentaLista()
{  
  

  this.solicitudPago=true;

  this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
    querySnapShot.forEach((doc) => {

      if(doc.data().mesa == this.informarEstadoMesa.mesa) // Comparamos las mesas y nos dara el pedido de esa mesa
      {
          doc.data().platosPlato.forEach(element => {
            this.firestore.collection('productos').get().subscribe((querySnapShot) => {
              querySnapShot.forEach((docP) => { 
     
                if(element == docP.data().nombre)
                {
                  let jsonPedido = {
                    precioUnitario : 0,
                    nombreProducto : ""
                  }
                  jsonPedido.precioUnitario = docP.data().precio;
                  jsonPedido.nombreProducto = element;
                  this.jsonCuenta.pedidos.push(jsonPedido);
                }
              })
                 
            });
          });

          doc.data().platosPostre.forEach(element => {
            this.firestore.collection('productos').get().subscribe((querySnapShot) => {
              querySnapShot.forEach((docP) => { 
     
                if(element == docP.data().nombre)
                {
                  let jsonPedido = {
                    precioUnitario : 0,
                    nombreProducto : ""
                  }
                  jsonPedido.precioUnitario = docP.data().precio;
                  jsonPedido.nombreProducto = element;
                  this.jsonCuenta.pedidos.push(jsonPedido);
                }
              })
                 
            });
          });

          doc.data().platosBebida.forEach(element => {
            this.firestore.collection('productos').get().subscribe((querySnapShot) => {
              querySnapShot.forEach((docP) => { 
     
                if(element == docP.data().nombre)
                {
                  let jsonPedido = {
                    precioUnitario : 0,
                    nombreProducto : ""
                  }
                  jsonPedido.precioUnitario = docP.data().precio;
                  jsonPedido.nombreProducto = element;
                  this.jsonCuenta.pedidos.push(jsonPedido);
                }
              })
                 
            });
          });
          this.jsonCuenta.precioTotal = doc.data().precioTotal;

      }

    })

  
  })
  this.menu.close();
}

pagarCuenta()
{
  let auxPedido;
  let auxLisEsp;

  this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
    querySnapShot.forEach((doc) => {
      if(doc.data().mesa == this.informarEstadoMesa.mesa)
      {
        auxPedido = doc.data();
        auxPedido.estado = "pagado"
        this.bd.actualizar("pedidos",auxPedido,doc.id);

        this.firestore.collection('listaEspera').get().subscribe((querySnapShot) => {
          querySnapShot.forEach((docDos) => {
            if(this.informarEstadoMesa.mesa == docDos.data().mesa)
            {
              this.informarEstadoMesa.mesa = '';
              this.informarEstadoMesa.seAsignoMesa = "no";
              // this.firestore.doc(docDos.id).delete() -> Fijarse como borrlo de la lista de espera
              this.firestore.collection('listaEspera').doc(docDos.id).delete();
             
              this.complementos.presentToastConMensajeYColor("Su pago esta por ser confirmado, gracias por utilizarnos!","success");
            }
          })
        });
      
      }

    })
  });

}
mostrarSolicitudMozo(){
  this.menuMozo=false;
  this.banderaMostrarCuentasPagadas = true;
  this.menu.close();

}
mostrarPedido(numero)
{
 this.mostrarP=true;
 this.mesaP=numero;  
}

liberarMesa(mesaA)
  {
    
    
    let auxMesa ;
    
    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      
      querySnapShot.forEach(dato => {  
        if(mesaA == dato.data().mesa)
        {

          this.firestore.collection('listaMesas').get().subscribe((querySnapShot) => {
      
            querySnapShot.forEach(datoMesa => {  

              if(mesaA == datoMesa.data().mesa)
              {
                auxMesa = datoMesa.data();
                auxMesa.estado = "desocupada";
                this.bd.actualizar("listaMesas",auxMesa,datoMesa.id);
                this.firestore.collection('pedidos').doc(dato.id).delete();
                this.complementos.presentToastConMensajeYColor("La mesa a sido liberada","success");
              }

             })

          });
        }

      })

    });
    this.menuMozo=true;
    this.banderaMostrarCuentasPagadas = false;
  }

}