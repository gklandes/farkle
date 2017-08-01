import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class GameService {
  private game: Game;

  constructor() {
    this.game = this.init();
  }

  hasGame () {
    return !!this.game.players.length;
  }

  getPlayer (index) {
    return this.game.players[index];
  }

  start (players: Player[], goal: number) {
    console.log('start', players);
    this.game = new Game(players, goal);
    this.save();
  }

  private init () {
    const obj = JSON.parse(localStorage.getItem('saveGame'));
    console.log(obj instanceof Game);
    const players = !!obj ? obj.players : [];
    const goal = !!obj ? obj.goal : [];
    return new Game(players,goal);
  }

  private save () {
    localStorage.setItem('saveGame', JSON.stringify(this.game));
  }
}

class Game {
  turn: number;
  constructor (
    public players: Player[] = [],
    public goal: number
  ) {
    this.turn = 0;
  }
}

export class Player {
  constructor (
    public name: string = '',
    public score: number = 0
  ) {}
}