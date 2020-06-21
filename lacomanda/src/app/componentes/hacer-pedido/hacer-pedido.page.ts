import { Component, OnInit , Input} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';
import { DatabaseService } from 'src/app/servicios/database.service';

interface Producto {
  tipo:string,
  nombre:string,
 descripcion:string,
  precio : number,
}
@Component({
  selector: 'app-hacer-pedido',
  templateUrl: './hacer-pedido.page.html',
  styleUrls: ['./hacer-pedido.page.scss'],
})



export class HacerPedidoPage implements OnInit {
 
  lista = [];
  listajson : Producto[];
  bandera="";
  @Input() tipo;

  cantidad = 0;
  totalProducto= 0;
  productoJson:Producto;
 /*productoJson = {
      tipo:"",
      nombre:"",
     descripcion: "",
      precio : "",
      //foto: ["","",""],
    }*/
    productoA: string;
  constructor(
    private firestore : AngularFirestore,
    public alertController: AlertController ,
    public router : Router,
    private bd : DatabaseService,
  ) { }

  ngOnInit() {
     
   // console.log(this.listaProductos);
  }


  listarProductos(pro : string)
  {
    if(pro=="comida")
    {
      this.bandera=pro;
      console.log(this.bandera);
      this.cargarProductos();
    }
    else if(pro=="bebida")
    {
      this.bandera=pro;
      this.cargarProductos();
    }else{
      this.bandera=pro;
      this.cargarProductos();
    }
  }

  cargarProductos()
{
 

  this.firestore.collection('productos').get().subscribe((querySnapShot) => {
    
    querySnapShot.forEach(datos => {


      if(datos.data().tipo === this.bandera){
        localStorage.setItem('tipocomida',this.bandera);
        let fb = this.firestore.collection('productos');
            
        fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
          
          this.lista = [];
      
         datos.forEach( (dato: any) =>{

            
      
    //let producto= this.productoJson;
    //this.listajson.push(this.productoJson);
         this.lista.push(dato);  
            // <--- LISTA DE USUARIOS.
      
          });
      
        })
       // console.log(this.listajson);
      }
        //this.tipo = datos.data().tipo;
       // 
      });
      })

     /* if(this.tipo==this.bandera)
      {
       

      }*/
    
}

/*tomados(){
 
  

    this.firestore.collection('productos').get().subscribe((querySnapShot) => {
      querySnapShot.forEach( (dato) => {
       
         if(dato.data().tipo =='comida'){

          this.productoJson = {
            nombre:dato.data().nombre,
           tipo:dato.data().tipo,
           precio:dato.data().precio,
          
         descripcion:dato.data().descripcion
          }
            

            //console.log(this.productoJson);
           
           this.listajson.push(this.productoJson);

        }
         
        

          // esto pone la lista vacía para que quede facherisima.
          

      })
    
      
      console.log(this.listajson);
    })
   
    
}*/

  async alert(){


  const alert =  await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Escriba su consulta',
    inputs: [
      {
        name: 'name1',
        type: 'text',
        placeholder: 'escribe aqui',
        
      }
    ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'aceptar',
          handler: (data) => {
            localStorage.setItem('consulta',data.name1);
           console.log(data.name1);
          }
        }
      ]
    });
  
    await alert.present();
  
  /*await this.alertController.create({
    message: '<h1>¡Solicitud de cuenta enviada con exito!</h1>No podras iniciar sesion hasta que nuestros administradores acepten tu solicitud de cliente',
    cssClass: 'custom-alert-danger',
    buttons: [
      {
        text: '¡Exelente! volver al inicio',
        handler: () => {
          this.router.navigate(['/']);
        }
      }]
  }); */
  
}

calcularProducto(nombre:string,signo: string){

  this.firestore.collection('productos').get().subscribe((querySnapShot) => {
    
    querySnapShot.forEach((datos => {

if(signo === '+' && datos.data().nombre === nombre && datos.data().cantidad === 0 )
{
  let auxCantidad= datos.data().cantidad;
   auxCantidad=this.cantidad++;



  console.log(datos.data().nombre);
  console.log(this.cantidad);
  this.bd.actualizar('productos',auxCantidad,datos.id);
  console.log(datos.data().cantidad);
  


 
} 
else if(signo === '-' && datos.data().id === nombre)
{
 
  if(this.cantidad>0)
  {
    this.cantidad--;
  }
  else
  {
this.cantidad= 0;
/**un toas para que el usuario entienda que no puede seguir tocando ah */
  }

}
/*datos.data().cantidad=this.cantidad;
let cantidad = this.cantidad;
this.bd.actualizar('productos',cantidad,datos.data().cantidad);*/

}));
})
  /*this.firestore.collection('productos').get().subscribe((querySnapShot) => {
    
  querySnapShot.forEach(datos => {

   // console.log(nombre);
    if(datos.data().nombre == nombre){
     // console.log(datos.data().nombre);
      let precioProducto= datos.data().precio;
      console.log(precioProducto);
      console.log(this.cantidad);
    
     this.totalProducto = precioProducto * this.cantidad;
      console.log(this.totalProducto);
     
    }
  });
})
*/


}

}