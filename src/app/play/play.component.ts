import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { GameService, Player } from '../game.service';
import { DieComponent } from '../die/die.component';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit {
  dice: Array<{ value: number, held: boolean }>;
  player: Player;
  phase: string;
  message: string;
  turn: {
    score: number,
    roll: Array<number>,
    rollScore: number
  };

  private pIndex: number;

  constructor(
    private gameService: GameService,
    private router: Router
  ) {
    this.dice = [];
  }

  ngOnInit() {
    // check for game
    if (!this.gameService.hasPlayers()) {
      this.router.navigate(['/newgame']);
      return;
    }
    // make dice
    for (let i = 1; i <= 6; i++) {
      this.dice.push({
        value: 0,
        held: false
      });
    };
    // start the current turn
    this.player = this.gameService.getPlayer();
    this.phase = 'start';
    this.message = 'When you are ready, click ROLL!';
    this.resetTurn();
  }

  roll () {
    this.phase = 'roll';
    _.chain(this.dice)
      .filter(x => !x.held)
      .each(this.setRollVal)
    ;
    this.checkRoll();
  }

  hold (die) {
    die.held = !die.held;
  }

  private resetTurn () {
    this.turn = {
      score: 0,
      roll: [],
      rollScore: 0
    };
  }

  private checkRoll () {
    const faces = [1, 2, 3, 4, 5, 6];
    const dice = _.chain(this.dice)
      .filter(x => !x.held)
      .map(x => x.value)
      .value()
      .sort()
    ;

    // a 'straight' is easy, else analyze the dice
    if (_.isEqual(dice, faces)) {
      this.score(1000, 'Straight!');
    } else {
      let counts = _.reduce(faces, (o, face) => {
        o[face] = 0;
        _.each(dice, die => { if (die === face) { o[face]++; } });
        return o;
      }, {});
      let pairs = _.filter(counts, x => x === 2);
      let triples = _.filter(counts, x => x === 3);
      let quads = _.filter(counts, x => x === 4);
      let pents = _.filter(counts, x => x === 5);
      let fullset = _.filter(counts, x => x === 6);
      console.log( 'counts:', counts, '\npairs:', pairs, 'triples:', triples, 'quads:', quads, 'pents:', pents, 'fullset:', fullset);
    }
  }

  private score (points: number, msg: string) {
    this.turn.score += points;
    this.message = msg;
  }

  private setRollVal (x) {
    x.value = Math.floor(Math.random() * 6) + 1;
  }
}
