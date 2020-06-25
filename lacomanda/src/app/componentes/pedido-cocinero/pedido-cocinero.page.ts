import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-pedido-cocinero',
  templateUrl: './pedido-cocinero.page.html',
  styleUrls: ['./pedido-cocinero.page.scss'],
})
export class PedidoCocineroPage implements OnInit {

  constructor(
    private firestore : AngularFirestore,
    private bd : DatabaseService,
    private ba: AngularFirestore
  ) { }
  listaPedido=[];
  mostrar= false;
  mesa;
  nany = 1;
  ngOnInit() {
    let fb = this.firestore.collection('pedidos');
   
      fb.valueChanges().subscribe(datos =>{      
        
        this.listaPedido = [];
  
        datos.forEach( (dato:any) =>{
  
          if(dato.estado == 'enProceso' && dato.estadoChef =='pendiente' || dato.estadoChef=='elaborado') 
          {
            this.listaPedido.push(dato);     
          }
    
          
        });
  
      })
  }
 

mostrarPedido(numero,plato,postre)
{
 this.mostrar=true;
 this.mesa=numero;  
}


elaborarPedido(mesa)
{
  let aux;
  this.firestore.collection('pedidos').get().subscribe( (querySnapShot)=>{ querySnapShot.forEach((dato) =>{      
    
          if(dato.data().mesa === mesa && dato.data().estado === 'enProceso') 
          {
           aux=dato.data();
           aux.estadoChef="elaborado"; 
           this.nany = 0;
           this.bd.actualizar('pedidos',aux,dato.id);
          }
    
          
        })
  
      })
  
  }
  pedidoListo(mesa)
{
  let aux;
  this.firestore.collection('pedidos').get().subscribe( (querySnapShot)=>{ querySnapShot.forEach((dato) =>{      
    
        
          if(dato.data().mesa === mesa && dato.data().estado === 'enProceso') 
          {
           aux=dato.data();
           aux.estadoChef="listo";  
           this.nany = 3;
           this.bd.actualizar('pedidos',aux,dato.id);
          }
          
        })
  
      })
  
  }
}
