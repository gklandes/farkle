import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DieComponent } from './die/die.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';
import { SetupComponent } from './setup/setup.component';

@NgModule({
  declarations: [
    AppComponent,
    DieComponent,
    HomeComponent,
    SetupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
