import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarAnonimoPageRoutingModule } from './registrar-anonimo-routing.module';

import { RegistrarAnonimoPage } from './registrar-anonimo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarAnonimoPageRoutingModule
  ],
  declarations: [RegistrarAnonimoPage]
})
export class RegistrarAnonimoPageModule {}
