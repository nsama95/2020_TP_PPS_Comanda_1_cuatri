import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : string;

  constructor(private router : Router,
    private menu: MenuController ) {  }



  ngOnInit() {

    let auxUsuario = JSON.parse(localStorage.getItem("usuario"));
    
    this.perfilUsuario = auxUsuario.perfil;
    console.log(this.perfilUsuario);
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