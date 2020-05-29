import { Component, OnInit } from '@angular/core';

// IMPORTO LA CLASE USUARIO.
import { Usuario } from "../../clases/usuario";

// IMPORTO EL TIMER:
import { timer } from 'rxjs';

// SERVICIO DE COMPLEMENTOS.
import {ComplementosService} from "../../servicios/complementos.service"

// IMPORTO EL SERVICIO DE AUTH.
import { AuthService } from "../../servicios/auth.service";


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  email : string;
  password : string;


  users: Usuario[] = [
  { id: 1, email: "supervisor@supervisor.com", password: "111111", perfil: "supervisor"},
  { id: 2, email: "duenio@duenio.com", password: "222222", perfil: "dueño"},
  { id: 3, email: "mozo@mozo.com", password: "333333", perfil: "mozo"},
  { id: 4, email: "cocinero@cocinero.com", password: "444444", perfil: "cocinero" },
  { id: 5, email: "metre@metre.com", password: "555555", perfil: "metre"},
  { id: 6, email: "anonimo@anonimo.com", password: "666666", perfil: "anonimo"}]


  constructor(
  private authService : AuthService,
  private complementos : ComplementosService,  
  public router : Router, 

  ) { }

  ngOnInit() {
  }



// Con el boton, esto hace que directamente se verifique el usuario existe. Si lo hace, entra a home. Sino, da error.
public onSubmitLogin()
{

  this.authService.login(this.email, this.password)
  
  .then(res => { 

    this.complementos.presentLoading();

    //let audio = new Audio();
    //audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
    //audio.play();

    timer(2000).subscribe(() => {this.router.navigate(['/home']);
  });

  }).catch(err => this.complementos.ngValidarError(err.code));
}


// Boton para limpiar.
public onClearAll()
{
  this.email = null;
  this.password = null;

  let audio = new Audio();
  audio.src = 'assets/audio/login/sonidoBotonBORRAR.mp3';
  audio.play();
}


// Selector de usuarios.
pickUser(pickedName) {
  this.users.forEach((user) => {
    if (user.perfil === pickedName) {
      this.email = user.email;
      this.password = user.password;
      return;
    }
  });
}

  

}
