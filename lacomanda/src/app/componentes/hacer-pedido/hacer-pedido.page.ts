import { Component, OnInit , Input} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';
import { DatabaseService } from 'src/app/servicios/database.service';
import { ComplementosService } from 'src/app/servicios/complementos.service';

export interface Producto {
  tipo:string,
  nombre:string,
  cantidad: number,
  precio : number,
}

@Component({
  selector: 'app-hacer-pedido',
  templateUrl: './hacer-pedido.page.html',
  styleUrls: ['./hacer-pedido.page.scss'],
})



export class HacerPedidoPage implements OnInit {

largo: number;
  
  lista = [];

  bandera="";


  cantidad = 0;
  totalProducto= 0;

  productoJson:Producto;

  pedidoEnFormatoJSON = {
    platosPlato :[],
    platosBebida : [],
    platosPostre : [],
    precioTotal : 0,
    estadoChef : "pendiente",
    estadoBartender : "pendiente",
    mesa : localStorage.getItem('mesaCliente'),
    estado:'pendiente'
  };
    productoA: string;
    listaProductosTipoPlato = [];
    listaProductosTipoBebida = [];
    listaProductosTipoPostre = [];
    contadorPlatos = 0;
    contadorBebidas = 0;
  contadorPostres = 0;
  contadorVecesQueConfirmaPedido = 0;
  
    variabledesplegarPedido = false;
  constructor(
    private firestore : AngularFirestore,
    public alertController: AlertController ,
    public router : Router,
    private bd : DatabaseService,
    private complementos : ComplementosService
  ) { }


  ngOnInit() {
    this.productoJson = {
      tipo: "",
      nombre : "",
      precio : 0,
      cantidad : 0
    }
    //this.bandera = "comida";
    this.contadorPlatos = 0;
    this.contadorBebidas = 0;
    this.contadorPostres = 0;
    this.contadorVecesQueConfirmaPedido = 0;

    this.variabledesplegarPedido = false;
  
   

  }


  listarProductos(pro : string)
  {
    if(pro=="comida")
    {
      this.bandera=pro;
      
      this.listaProductosTipoPlato = this.cargarProductosTipo("comida");
      
    }
    else if(pro=="bebida")
    {
      this.bandera=pro;
      this.listaProductosTipoBebida = this.cargarProductosTipo("bebida");
     
    }else{
      this.bandera=pro;
      this.listaProductosTipoPostre = this.cargarProductosTipo("postre");
      
    }
  }

  cargarJSONPedidosPlatos(plato : string, tipoDePlato : string, precio : number,producto :Producto)
  {
   
    if (tipoDePlato == "comida")
    { 
      console.log(this.productoJson);
     // console.log(producto);
    this.productoJson.nombre=producto.nombre;
    this.productoJson.precio=producto.precio;
    this.productoJson.tipo=producto.tipo;
  
      this.productoJson.cantidad=1;
      this.pedidoEnFormatoJSON.platosPlato.push(this.productoJson);
      //if()

      this.contadorPlatos = this.contadorPlatos + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;

      /*if(this.pedidoEnFormatoJSON.platosPlato.length>1){
        for(var i=0;i<=this.pedidoEnFormatoJSON.platosPlato.length;i++){
          this.largo=0;
          console.log('for de  i');
          console.log(i);
          console.log(this.pedidoEnFormatoJSON.platosPlato.length);

         let nombrei= this.pedidoEnFormatoJSON.platosPlato[i].nombre;

          for (var j=i+1; j <=this.pedidoEnFormatoJSON.platosPlato.length; j++) {
            console.log(this.pedidoEnFormatoJSON.platosPlato.length);
            console.log('for de  j');
            console.log(j);
            console.log(i);
            let nombreJ= this.pedidoEnFormatoJSON.platosPlato[j].nombre;
            console.log(this.pedidoEnFormatoJSON.platosPlato[j].nombre);
           if( nombrei === nombreJ)
           {
            console.log('entre al if');
            this.largo=1;
            this.pedidoEnFormatoJSON.platosPlato[i].cantidad++;
            
           }else{
            this.largo=1;
            this.pedidoEnFormatoJSON.platosPlato[i].cantidad=this.largo;
            console.log('entro al else');
           }
        }
          
        }

      }*/
    
    
    
      
     
      
    }

    if (tipoDePlato == "bebida")
    {
      this.pedidoEnFormatoJSON.platosBebida[this.contadorBebidas] = plato;
      this.contadorBebidas = this.contadorBebidas + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
      
    }

    if (tipoDePlato == "postre")
    {
      this.pedidoEnFormatoJSON.platosPostre[this.contadorPostres] = plato;
      this.contadorPostres = this.contadorPostres + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
    }


    console.log(this.pedidoEnFormatoJSON);


  }


  cargarProductosTipo(tipoProducto : string) : any
  {

    var listaProductos = [];
    this.firestore.collection("productos").get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        // Correo de la BD == Correo de la lista.
       if(doc.data().tipo == tipoProducto)
       {
        listaProductos.push(doc.data()); 
        
     
       }

      })
    })

    return listaProductos;
  }






 


  

desplegarPedido()
  {
    this.variabledesplegarPedido = true;
  }

  desplegarInversoPedido()
  {
    this.variabledesplegarPedido = false;
  }


  confirmarPedido()
  {

    if (this.contadorVecesQueConfirmaPedido == 0 && this.pedidoEnFormatoJSON.precioTotal>0)
    {
      this.complementos.presentToastConMensajeYColor("Pedido generado con éxito. Será redirigido al menú!", "success")
      this.bd.crear('pedidos',this.pedidoEnFormatoJSON);
      this.contadorVecesQueConfirmaPedido = 1;
    }else if(this.contadorVecesQueConfirmaPedido == 0 && this.pedidoEnFormatoJSON.precioTotal==0){
      this.complementos.presentToastConMensajeYColor("¡No se puede confirmar un pedido vacio!", "warning")
    }

    else
    {
      this.complementos.presentToastConMensajeYColor("¡Su orden ya fue cargada!", "warning")
    }

   
  }
  
  cancelarPedido()
  {
    if (this.contadorVecesQueConfirmaPedido == 0&& this.pedidoEnFormatoJSON.precioTotal>0)
    {
      this.pedidoEnFormatoJSON.platosPlato = [];
      this.pedidoEnFormatoJSON.platosBebida = [];
      this.pedidoEnFormatoJSON.platosPostre = [];
      this.pedidoEnFormatoJSON.precioTotal = 0;


      this.contadorPlatos = 0;
      this.contadorBebidas = 0;
      this.contadorPostres = 0;

      this.complementos.presentToastConMensajeYColor("¡El pedido fue cancelado!", "success")
    }
    else if(this.contadorVecesQueConfirmaPedido == 0 && this.pedidoEnFormatoJSON.precioTotal==0){
      this.complementos.presentToastConMensajeYColor("¡No se puede cancelar un pedido vacio!", "warning")
    }
    else
    {
      this.complementos.presentToastConMensajeYColor("¡No puede cancelar un pedido ya enviado!", "warning")
    }
    
  }

 eliminar(plato : string, tipoDePlato : string, precio : number)
  {
   
    if (tipoDePlato == "comida")
    {

      let auxIndice = this.pedidoEnFormatoJSON.platosPlato.indexOf(plato);

      if(auxIndice >= 0 ){
        let retorno = this.pedidoEnFormatoJSON.platosPlato.splice(auxIndice,1);

          if(this.pedidoEnFormatoJSON.precioTotal > 0 && retorno.length > 0)
          {
            this.contadorPlatos = this.contadorPlatos - 1;
            this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal - precio;
          }
      }
    }

    if (tipoDePlato == "bebida")
    {

      let auxIndice = this.pedidoEnFormatoJSON.platosBebida.indexOf(plato);

      if(auxIndice >= 0 ){
        let retorno = this.pedidoEnFormatoJSON.platosBebida.splice(auxIndice,1);

          if(this.pedidoEnFormatoJSON.precioTotal > 0 && retorno.length > 0)
          {
            this.contadorBebidas = this.contadorBebidas - 1;
            this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal - precio;
          }
      }


    }

    if (tipoDePlato == "postre")
    {
      let auxIndice = this.pedidoEnFormatoJSON.platosPostre.indexOf(plato);

      if(auxIndice >= 0 ){
        let retorno = this.pedidoEnFormatoJSON.platosPostre.splice(auxIndice,1);

          if(this.pedidoEnFormatoJSON.precioTotal > 0 && retorno.length > 0)
          {
            this.contadorPostres = this.contadorPostres - 1;
            this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal - precio;
          }
      }
     
    }


   console.log(this.pedidoEnFormatoJSON);


  }

}