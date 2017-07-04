import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor (private gameService: GameService) {
    this.loadGame();
  }
  private loadGame() {
    this.gameService.load(JSON.parse(localStorage.getItem('saveGame')));
  }
}
