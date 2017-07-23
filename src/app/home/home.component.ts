import { Component, OnInit } from '@angular/core';
// import { MdButtonModule } from '@angular/material';
import { GameService } from '../game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  hasGame: Boolean;

  constructor (
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.hasGame = this.gameService.hasGame();
  }

}
