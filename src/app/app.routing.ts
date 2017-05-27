import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SetupComponent } from './setup/setup.component';

// Route Configuration
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'setup', component: SetupComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);