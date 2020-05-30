import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { AltaClienteComponent } from './componentes/alta-cliente/alta-cliente.component';


const routes: Routes = [
  //{ path:'registro',component:AltaClienteComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./componentes/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./componentes/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'registrar-empleado',
    loadChildren: () => import('./componentes/registrar-empleado/registrar-empleado.module').then( m => m.RegistrarEmpleadoPageModule)
  },
  {
    path: 'registrar-supervisor',
    loadChildren: () => import('./componentes/registrar-supervisor/registrar-supervisor.module').then( m => m.RegistrarSupervisorPageModule)
  },  {
    path: 'registrar-anonimo',
    loadChildren: () => import('./componentes/registrar-anonimo/registrar-anonimo.module').then( m => m.RegistrarAnonimoPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
