import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  constructor(
    private firestore : AngularFirestore,
    private bd : DatabaseService,
    private ba: AngularFirestore
  ) { }
  listaPedido=[];
 mostrar= false;
 mesa;
 /*ensalada= 0;
 empanada=0;
 papas=0;
 picada=0;
 pasta=0;
 agua=0;
 campari=0;
 coca=0;
 pepsi=0;
 vino=0;
 lemon=0;
 flan=0;
 helado=0;
 milkshake=0;
 torta=0;*/
  ngOnInit() {
    let fb = this.firestore.collection('pedidos');
   
      fb.valueChanges().subscribe(datos =>{      
        
        this.listaPedido = [];
  
        datos.forEach( (dato:any) =>{
  
          if(dato.estado == 'pendiente') 
          {
            this.listaPedido.push(dato);     
          }
          if(dato.platosPlato){

          }
          
        });
  
      })
  }
 
 mostrarPedido(numero,bebida,plato,postre)
 {
  this.mostrar=true;
  this.mesa=numero;
  
 /* let fb = this.firestore.collection('productos');
  for(var i=0;i<= plato.length;i++){
     this.ba.collection('productos', ref => ref.where('tipo', '==' , 'comida'));
   
    this.firestore.collection('productos').get().subscribe( (querySnapShot)=>{ querySnapShot.forEach((dato) =>{      
  
      
      if(dato.data().nombre === plato[i]) 
      {
        console.log(plato[i])
        console.log(dato.data().tiempo)
        switch(plato[i])
  {
    case'Ensalada Vegana':
    this.ensalada= dato.data().tiempo;
    //console.log( this.ensalada)
    break;
  }

      }
      
    })

  })*/
   
 }




 derivar(mesa){
   let aux;
this.firestore.collection('pedidos').get().subscribe( (querySnapShot)=>{ querySnapShot.forEach((dato) =>{      
  
        if(dato.data().mesa === mesa) 
        {
          aux=dato.data();
         aux.estado="enProceso";  
         aux.estadoBartender="enProceso";
         aux.estadoChef="enProceso";
         this.bd.actualizar('pedidos',aux,dato.id);
        }
        
      })

    })

}

}
