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
  scoreSets: {};

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
    this.scoreSets = {};
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

  roll (): void {
    this.phase = 'roll';
    this.closeMessage();
    this.scoreSets = {};

    // roll the open dice
    _.chain(this.dice)
      .filter(x => x.status === 'open')
      .each(this.setRollVal)
    ;
    this.turn.roll = this.dice.map(x => x.value);

    // analyze dice
    const faces = [1, 2, 3, 4, 5, 6];
    const counts = _.reduce(faces, (arr, face, i) => {
      const obj = { face: face, qty: 0, indexes: [] };
      _.each(this.dice, (die, ii) => {
        if (die.status === 'open' && die.value === face) {
          obj.qty++;
          obj.indexes.push(ii);
        }
      });
      arr.push(obj);
      return arr;
    }, []);
    console.log(counts);

    const rolled = this.dice.reduce((arr, x, i) => {
      if (x.status === 'open') { arr.push(_.extend({ index: i }, x)); }
      return arr;
    }, []);
    const allRolled = rolled.map(x => x.index);

    const pairs = _.where(counts, {qty: 2});
    const triples = _.where(counts, {qty: 3});
    const quads = _.where(counts, {qty: 4});
    const pents = _.where(counts, {qty: 5});
    const fullset = _.where(counts, {qty: 6});

    // mark single scoring rolled
    this.addToScoreSets('one', this.getIndexesByValue(1));
    this.addToScoreSets('five', this.getIndexesByValue(5));

    // find combo patterns
    if (_.isEqual(rolled.map(x => x.value).sort(), faces)) {this.addToScoreSets('straight', allRolled); }
    if (pairs.length === 3) { this.addToScoreSets('3pair', allRolled); }
    if (triples.length === 2) { this.addToScoreSets('2triple', allRolled); }
    if (fullset.length === 1) { this.addToScoreSets('6set', allRolled); }
    if (pents.length === 1) { this.addToScoreSets('5set', _.findWhere(counts, {qty: 5}).indexes); }
    if (quads.length === 1) { this.addToScoreSets('4set', _.findWhere(counts, {qty: 4}).indexes); }
    if (!this.scoreSets['2triple'] && triples.length === 1) { this.addToScoreSets('triple', _.findWhere(counts, {qty: 3}).indexes); }

    // if (farkle) {
    //   this.openMessage('farkle');
    //   this.phase = 'farkle';
    // }
    console.log( 'counts:', counts,
      '\npairs:', pairs.length,
      'triples:', triples.length,
      'quads:', quads.length,
      'pents:', pents.length,
      'fullset:', fullset.length,
      '\nscoreSets', this.scoreSets,
      '\nrolled', rolled,
    );

  }

  getScoreSetsByDie(i: number) {
    const arr = [];
    // TODO: why doesn't this validate?
    // _.each(this.scoreSets, (val, key) => {
    //   if (val.indexes.indexOf(i) >= 0) { arr.push(key); }
    // });
    for (const set in this.scoreSets) {
      if (this.scoreSets.hasOwnProperty(set)) {
        if (this.scoreSets[set].indexOf(i) >= 0) { arr.push(set); }
      }
    }
    return arr;
  }

  private addToScoreSets(set: string, indexes: number[]): void {
    this.scoreSets[set] = indexes;
  }

  private getIndexesByValue (val: number): number[] {
    return _.chain(this.dice)
      .reduce((arr, x, i) => {
        if (x.status === 'open' && x.value === val) { arr.push(i); }
        return arr;
      }, [])
      .value();
  }

  private openMessage (msg): void {
    if (!msg) { return; }
    this.message = msg;
  }

  private closeMessage (): void {
    this.message = '';
  }

  private setRollVal (x: Die): void {
    x.value = Math.floor(Math.random() * 6) + 1;
  }
}

interface Die {
  value: number;
  status: string; // held, used, open
  scoreSets: Array<string>;
  scoreAs: string;
}
