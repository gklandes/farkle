import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { GameService, Player, Turn } from '../game.service';
import { DieComponent } from '../die/die.component';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit {
  message: string;
  dice: Array<Die>;
  turn: Turn;
  player: Player;
  phase: string;

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    // check for game
    if (!this.gameService.hasGame()) {
      this.router.navigate(['/newgame']);
      return;
    }
    // make message
    this.message = '';
    // make dice
    this.dice = [];
    for (let i = 1; i <= 6; i++) {
      this.dice.push({
        value: 0,
        status: 'open',
        scoreSets: [],
        scoreAs: null
      });
    };
    // start the current turn
    this.prep(true);
  }

  private prep (newturn: boolean = false): void {
    if (!this.turn || newturn) {
      this.turn = this.gameService.getTurn();
      this.player = this.gameService.getPlayer(this.turn.index);
      this.phase = 'init';
    } else {
      this.phase = 'prep';
    }
    this.openMessage('roll');
  }

  roll (): void {
    this.phase = 'roll';
    this.closeMessage();
    _.chain(this.dice)
      .filter(x => x.status === 'open')
      .each(this.setRollVal)
    ;
    this.turn.roll = this.dice.map(x => x.value);
    this.checkRoll();
  }

  pass (): void {
    this.phase = 'init';
    this.player.score += this.turn.score;
    _.each(this.dice, x => {
      x.status = 'open';
      x.scoreSets = [];
    });
    this.prep(true);
  }

  accept (): void {
    this.phase = 'prep';
    this.turn.score += this.turn.rollScore;
    this.turn.rollScore = 0;
    _.each(this.dice, x => {
      if (x.status === 'held') { x.status = 'used'; }
      x.scoreSets = [];
    });
    this.openMessage('again');
  }

  take (e: Event, i: number, set: string): void {
    e.stopPropagation();
    const die = this.dice[i];
    if (die.status !== 'open') { return; }
    if (set === 'single') {
      die.status = 'held';
      die.scoreAs = set;
    } else {
      _.each(this.dice, x => {
        x.status = 'held';
        x.scoreAs = set;
      });
    }
    this.turn.rollScore += this.getSetValue(die, set);
  }

  release (i: number, set: string): void {
    const die = this.dice[i];
    if (die.status !== 'held') { return; }
    die.status = 'open';
    die.scoreAs = null;
    this.turn.rollScore -= this.getSetValue(die, die.scoreAs);
  }

  getSetValue (die, set: string): number {
    return {
      'straight': 1000,
      '3pair': 1500,
      '2triple': 2500,
      '6set': 3000,
      '5set': 2000,
      '4set': 1000,
      'triple': die.value === 1 ? 300 : die.value * 100,
      'single': die.value === 1 ? 100 : 50
    }[set];
  }

  private checkRoll (): void {
    let farkle = true;
    const faces = [1, 2, 3, 4, 5, 6];
    // const dice = _.chain(this.dice)
    //   .filter(x => !x.held)
    //   .value()
    //   .sort()
    // ;
    // mark single scoring dice
    _.each(this.dice, x => {
      if (x.value === 1 || x.value === 5) {
        farkle = false;
        x.scoreSets.push('single');
      }
    });

    if (farkle) {
      this.openMessage('farkle');
      this.phase = 'farkle';
    }
    // analyze the dice
    // const counts = _.reduce(faces, (count, face) => {
    //   count[face] = 0;
    //   _.each(dice, die => {
    //     if (die.value === face) { count[face]++; }
    //   });
    //   return count;
    // }, {});
    // const pairs = _.filter(counts, x => x === 2);
    // const triples = _.filter(counts, x => x === 3);
    // const quads = _.filter(counts, x => x === 4);
    // const pents = _.filter(counts, x => x === 5);
    // const fullset = _.filter(counts, x => x === 6);
    // console.log( 'counts:', counts,
    //   '\npairs:', pairs.length,
    //   'triples:', triples.length,
    //   'quads:', quads.length,
    //   'pents:', pents.length,
    //   'fullset:', fullset.length
    // );

    // find full score patterns
    // if (_.isEqual(dice, faces)) { return [1000, 'straight']; }
    // if (dice.length === 6 && pairs.length === 3) { return [1500, '3pair']; }
    // if (dice.length === 6 && triples.length === 2) { return [2500, '2triple']; }
    // if (dice.length === 6 && fullset.length === 1) { return [3000, '6set']; }
    // if (dice.length === 5 && pents.length === 1) { return [2000, '5set']; }
    // if (dice.length === 4 && quads.length === 1) { return [1000, '4set']; }
    // if (dice.length === 3 && triples.length === 1) { return [3000, 'triple']; }

    // console.log('no score');
    // return [0, ''];
  }

  private openMessage (msg): void {
    if (!msg) { return; }
    this.message = msg;
  }

  private closeMessage (): void {
    this.message = '';
  }

  private setRollVal (x: Die): void {
    x.scoreSets = [];
    x.value = Math.floor(Math.random() * 6) + 1;
  }
}

interface Die {
  value: number;
  status: string; // held, used, open
  scoreSets: Array<string>;
  scoreAs: string;
}
