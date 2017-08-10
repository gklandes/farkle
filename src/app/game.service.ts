import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class GameService {
  private game: Game;

  constructor() {
    const obj = JSON.parse(localStorage.getItem('saveGame'));
    const players = !!obj ? obj.players : [];
    const goal = !!obj ? obj.goal : 1000;
    this.game = new Game(players, goal);

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
  nextTurn (): Turn {
    let i = this.game.turn.index;
    if (i < 0) {
      i = 0;
    } else {
      i = (i + 1 < this.game.players.length) ? i++ : 0;
    }
    this.game.turn = {
      index: i,
      player: this.game.players[i],
      score: 0,
      roll: [],
      rollScore: 0
    };
    return this.game.turn;
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
  finisher: number | null;
  winner: number | null;
  turn: Turn;

  constructor (
    public players: Player[],
    public goal: number,
  ) {
    this.turn = {
      index: -1,
      player: null,
      score: 0,
      roll: [],
      rollScore: 0
    };
  }
}

/**
 * Turn
 * @desc object representing the current state of play
 * * player: the index of the current player
 * * score: the score for the current turn; it will be added to the player's
 * score at the end of their turn
 * * roll: an array of values for the 1 to 6 active dice
 * * rollScore: the score for the current roll as determined by the player's
 * selections; this is added to the player's turn score on the next roll or end
 * of turn
 */
export interface Turn {
    index: number;
    player: Player | null;
    score: number;
    roll: Array<number>;
    rollScore: number;
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
