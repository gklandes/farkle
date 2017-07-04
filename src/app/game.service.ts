import { Injectable } from '@angular/core';

@Injectable()
export class GameService {

  constructor() {}

  load (savegame){
    console.log('load', savegame);
  }

  newGame (players: Player[]) {
    console.log('newGame', players);
  }
}

class Game {
  players: [Player];
  constructor () {}
}

 export class Player {
  constructor (
    public name: string = '',
    public score: number = 0
  ) {}
}