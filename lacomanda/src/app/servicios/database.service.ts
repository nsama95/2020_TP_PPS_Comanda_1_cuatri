import { Injectable } from '@angular/core';
import {AngularFirestore,AngularFirestoreCollection } from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private firestore: AngularFirestore) { }
  
 //Crea un nuevo dato   
 public crear(collection: string, data: any) 
 {    
    return this.firestore.collection(collection).add(data);   
  }
 
   public obtenerPorId(coleccion:string,id:string)
   {
     return this.firestore.collection(coleccion).doc(id).snapshotChanges();
     // El documento que tenga ese id tal cual este ahora, le saca una foto y me lo devuelve
   }
 
   public obtenerTodos(coleccion:string)
   {
     return this.firestore.collection(coleccion).snapshotChanges();
   }
 
   public actualizar(coleccion:string, data:any,id:string)
   {
     return this.firestore.collection(coleccion).doc(id).set(data);
   }
}
