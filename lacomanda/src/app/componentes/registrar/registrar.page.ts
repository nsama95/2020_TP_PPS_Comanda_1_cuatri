import { Component, OnInit } from '@angular/core';
import{ComplementosService } from "../../servicios/complementos.service"

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  dni : string;

  constructor(private  complementos : ComplementosService) { }

  ngOnInit() {
  }

  escanear()
  {
    this.dni= this.complementos.escanearDni();
    
  }

}
