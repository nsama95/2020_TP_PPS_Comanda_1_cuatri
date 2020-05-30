import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarAnonimoPage } from './registrar-anonimo.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarAnonimoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarAnonimoPageRoutingModule {}
