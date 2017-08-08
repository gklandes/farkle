import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class GameService {
  private game: Game;

  constructor() {
    this.game = this.init();
  }

  /**
   * @desc simple test for players;
   * @returns {boolean}
   */
  hasPlayers (): boolean {
    return !!this.game.players.length;
  }

  /**
   * @desc retrieve the info for a player
   * @param index {number} optionally provide the index of a specific player; if
   *     not supplied, the current player is returned
   */
  getPlayer (index?: number): Player {
    if (index === undefined) { index = this.game.turn; }
    return this.game.players[index];
  }

  /**
   * @desc clear any current game and start a new one
   * @param players {Player} expects an array of Player objects
   * @param goal {number} an integer representing the score at which the game
   *     should trigger the last round.
   */
  newGame (players: Player[], goal: number): Game {
    this.game = new Game(players, goal);
    this.save();
    return this.game;
  }

  private init () {
    const obj = JSON.parse(localStorage.getItem('saveGame'));
    const players = !!obj ? obj.players : [];
    const goal = !!obj ? obj.goal : 1000;
    return new Game(players, goal);
  }

  private save () {
    localStorage.setItem('saveGame', JSON.stringify(this.game));
  }
}

/**
 * Game
 * @description this class is used in GameService as a serializable container for the
 *     unique data related to a game
 */
class Game {
  constructor (
    public players: Player[],
    public goal: number,
    public turn: number = 0,
    public turnScore: number = 0,
    public finisher: number | null = null,
    public winner: number | null = null
  ) {}
}

/**
 * Player
 * @desc represents a player in the game along with their score
 */
export class Player {
  constructor (
    public name: string = '',
    public score: number = 0
  ) {}
}
