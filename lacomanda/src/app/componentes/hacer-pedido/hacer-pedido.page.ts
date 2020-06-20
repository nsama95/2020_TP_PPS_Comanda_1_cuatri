import { Component, OnInit , Input} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';


@Component({
  selector: 'app-hacer-pedido',
  templateUrl: './hacer-pedido.page.html',
  styleUrls: ['./hacer-pedido.page.scss'],
})


export class HacerPedidoPage implements OnInit {
  lista = [];
  bandera="";
  @Input() tipo;
  constructor(
    private firestore : AngularFirestore,
    public alertController: AlertController ,
    public router : Router,
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
      
          datos.forEach( (dato:any) =>{
      
         this.lista.push(dato);  
            // <--- LISTA DE USUARIOS.
      //console.log(this.lista);
          });
      
        })
      }
        //this.tipo = datos.data().tipo;
       // 
      });
      })

     /* if(this.tipo==this.bandera)
      {
       

      }*/
    
}

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


}