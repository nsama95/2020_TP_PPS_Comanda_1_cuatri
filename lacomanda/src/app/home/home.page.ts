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

 /* constructor(private router : Router,
    private menu: MenuController ) {  }*/

    constructor(private router : Router) { }

  ngOnInit() {

    let auxUsuario = JSON.parse(localStorage.getItem("usuario"));
    
    this.perfilUsuario = auxUsuario.perfil;
    console.log(this.perfilUsuario);
  }


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

  items = [
    {icono : "clipboard" , nombre : "Pedidos" , ruta : "/home/registrar"},
    {icono : "card" , nombre : "Solicitudes de pago" , ruta  : "/menu-mozo/solicitud-pago"}
  ]
  jefeLogueado = {nombre : "Pablo" , apellido : "Hidalgo" , path : "../../../assets/mozo.png" , perfil : "Mozo"}

  Cerrar()
  {
    this.router.navigate(['/login']);
  }
  
}