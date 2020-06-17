import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from 'src/app/servicios/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-mesas',
  templateUrl: './lista-mesas.page.html',
  styleUrls: ['./lista-mesas.page.scss'],
})
export class ListaMesasPage implements OnInit {
  listadoMesas = [];
  constructor(private firestore : AngularFirestore,
    private bd : DatabaseService,
    private router : Router) { }

  ngOnInit() {

      // Cargamos las mesas disponibles
      let fb = this.firestore.collection('listaMesas');
   
      fb.valueChanges().subscribe(datos =>{      
        
        this.listadoMesas = [];
  
        datos.forEach( (dato:any) =>{
  
          if(dato.estado == 'desocupada') 
          {
            this.listadoMesas.push(dato);     
          }
          
        });
  
      })
  }


  asignarMesa(mesita)
  {
    // Se obtiene del local storage el usuario que se selecciono en el listado del metre
    let auxUs = localStorage.getItem('usuarioMesa');
    let auxUsJson = JSON.parse(auxUs); // Lo transformamos en json
  
    // Buscamos la mesa que se selecciono en la lista de mesas 
    this.firestore.collection('listaMesas').get().subscribe((querySnapShot) => {
     
      querySnapShot.forEach(dato => {

        // Si la mesa que se selecciono coincide con una mesa de la lista
        if(mesita.mesa == dato.data().mesa)
        {
          mesita.estado = "ocupada"; // Se le cambia el estado a la mesa
         
          this.bd.actualizar('listaMesas',mesita,dato.id); // Se actualiza el estado en la base de datos

          // Ahora recorremos en lista de espera para cambiar el estado del cliente, se le asigna el numero de mesa y el estado de mesa
          this.firestore.collection('listaEspera').get().subscribe((querySnapShot) => {

            querySnapShot.forEach(datoU => {
      
              if(auxUsJson.nombreUsuario == datoU.data().nombreUsuario)
        
              {
                
                auxUsJson.estadoMesa = "mesaAsignada"; // Cambiamos los estados
                auxUsJson.mesa = mesita.mesa;
                // Actualizamos la lista de espera con los nuevos cambios
                this.bd.actualizar('listaEspera',auxUsJson,datoU.id).then( end =>{
                 // Borramos el usuario seleccionado del local storage
                  localStorage.removeItem('usuarioMesa');
                }

                )

             
              }
            })
      
          })   
         
        }
        this.listadoMesas = []; // Limpiamos la lista de espera 
      })

    })   
  }



}
