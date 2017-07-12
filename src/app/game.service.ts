import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class GameService {
  private game: Game;

  constructor() {
    this.game = this.init();
  }

  start (players: Player[]) {
    console.log('start', players);
    this.game = new Game(players);
    this.save();
  }

  hasGame () {
    return !!this.game.players.length;
  }

  getPlayer (index) {
    return this.game.players[index];
  }

  private init () {
    const obj = JSON.parse(localStorage.getItem('saveGame'));
    const players = !!obj ? obj.players : [];
    return new Game(players);
  }

  private save () {
    localStorage.setItem('saveGame', JSON.stringify(this.game));
  }
}

class Game {
  constructor (
    public players: Player[] = []
  ) {}
}

export class Player {
  constructor (
    public name: string = '',
    public score: number = 0
  ) {}
}