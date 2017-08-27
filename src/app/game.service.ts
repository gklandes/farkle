import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class GameService {
  game: Game;

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
  hasGame (): boolean {
    return !!this.game.players.length;
  }

  /**
   * @desc retrieve the info for a player
   * @param index {number} optionally provide the index of a specific player; if
   *     not supplied, the current player is returned
   */
  getTurn (): Turn {
    let i = this.game.turn.index;
    i = (i + 2 > this.game.players.length) ? 0 : i + 1;

    this.game.turn = {
      index: i,
      score: 0,
      roll: [],
      rollScore: 0
    };
    this.updateTurn(this.game.turn);
    return this.game.turn;
  }

  getPlayer (i: number): Player {
    return this.game.players[i];
  }

  updateTurn (turn: Turn): void {
    _.extend(this.game.turn, turn);
    this.save();
  }

  updatePlayer (index: number, turnScore: number) {
    this.game.players[index].score += turnScore;
  }

  /**
   * @desc clear any current game and start a new one
   * @param players {Player} expects an array of Player objects
   * @param goal {number} an integer representing the score at which the game
   *     should trigger the last round.
   */
  newGame (players: Player[], goal: number): void {
    this.game = new Game(players, goal);
    this.save();
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
    score: number;
    roll: Array<number>;
    rollScore: number;
}

/**
 * Player
 * @desc represents a player in the game along with their score
 */
export interface Player {
    name: string;
    score: number;
}
