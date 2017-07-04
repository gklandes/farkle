import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewgameComponent } from './newgame/newgame.component';

// Route Configuration
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'newgame', component: NewgameComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);