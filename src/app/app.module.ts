import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import {
  MdButtonModule,
  MdToolbarModule,
  MdInputModule,
  MdSidenavModule
} from '@angular/material';

import { routing } from './app.routing';
import { GameService } from './game.service';
import { AppComponent } from './app.component';
import { DieComponent } from './die/die.component';
import { HomeComponent } from './home/home.component';
import { NewgameComponent } from './newgame/newgame.component';
import { PlayComponent } from './play/play.component';

@NgModule({
  declarations: [
    AppComponent,
    DieComponent,
    HomeComponent,
    NewgameComponent,
    PlayComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    MdButtonModule,
    MdToolbarModule,
    MdInputModule,
    MdSidenavModule
  ],
  providers: [
    GameService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
