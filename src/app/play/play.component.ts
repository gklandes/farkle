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
  message: { type: string; data?: {}; };
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
    this.closeMessage();
    // make dice
    this.dice = [];
    this.scoreSets = {};
    for (let i = 1; i <= 6; i++) {
      this.dice.push({
        value: 0,
        status: 'open',
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

  inPhase (...args: string[]): boolean {
    return args.indexOf(this.phase) >= 0;
  }

  pass (farkle: boolean = false): void {
    this.phase = 'init';
    if (!farkle) this.player.score += this.turn.score;
    _.each(this.dice, x => {
      x.status = 'open';
    });
    this.prep(true);
  }

  accept (): void {
    this.phase = 'prep';
    this.turn.score += this.turn.rollScore;
    this.turn.rollScore = 0;
    _.each(this.dice, x => {
      if (x.status === 'held') { x.status = 'used'; }
    });
    this.openMessage('again');
  }

  roll (): void {
    this.phase = 'roll';
    this.closeMessage();
    this.scoreSets = {};

    // roll the open dice
    _.chain(this.dice)
      .filter(x => x.status === 'open')
      .each(x => x.scoreAs = '')
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

    // find combo patterns
    let autoScore: string | boolean = false;
    if (_.isEqual(rolled.map(x => x.value).sort(), faces)) {
      autoScore = 'straight';
      this.addToScoreSets('straight', allRolled);
    }
    if (pairs.length === 3) {
      autoScore = '3pair';
      this.addToScoreSets('3pair', allRolled);
    }
    if (triples.length === 2) {
      autoScore = '2triple';
      this.addToScoreSets('2triple', allRolled);
    }
    if (fullset.length === 1) {
      autoScore = '6set';
      this.addToScoreSets('6set', allRolled);
    }
    if (pents.length === 1) {
      if (rolled.length === 5) { autoScore = '5set'; }
      this.addToScoreSets('5set', _.findWhere(counts, {qty: 5}).indexes);
    }
    if (quads.length === 1) {
      if (rolled.length === 4) { autoScore = '4set'; }
      this.addToScoreSets('4set', _.findWhere(counts, {qty: 4}).indexes);
    }
    if (triples.length === 1 && !this.scoreSets['2triple']) {
      if (rolled.length === 3) { autoScore = 'triple'; }
      this.addToScoreSets('triple', _.findWhere(counts, {qty: 3}).indexes);
    }

    // mark single scoring rolled
    if (counts[0].qty) { this.addToScoreSets('one', counts[0].indexes); }
    if (counts[4].qty) { this.addToScoreSets('five', counts[4].indexes); }

    // mark farkles :-(
    if (_.isEmpty(this.scoreSets)) { autoScore = 'farkle'; }

    console.log( 'counts:', counts,
      '\npairs:', pairs.length,
      'triples:', triples.length,
      'quads:', quads.length,
      'pents:', pents.length,
      'fullset:', fullset.length,
      '\nscoreSets', this.scoreSets,
      '\nrolled', rolled,
    );
    if (!!autoScore) {
      this.scoreDice(autoScore);
    }
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

  take (e: Event, i: number, set: string): void {
    e.stopPropagation();
    const die = this.dice[i];
    if (!this.inPhase('roll') || die.status === 'held') { return; }

    const s = this.scoreSets[set];
    if (set === 'one' || set === 'five') {
      die.status = 'held';
      die.scoreAs = set;
    } else {
      _.each(this.dice, (x, ii) => {
        if (s.indexOf(ii) >= 0) { 
          x.status = 'held';
          x.scoreAs = set;
        }
      });
    }
    this.turn.rollScore += this.getSetObject(set, die).points;
  }

  release (i: number, set: string): void {
    const die = this.dice[i];
    if (!this.inPhase('roll') || die.status !== 'held') { return; };

    const s = this.scoreSets[set];
    if (set === 'one' || set === 'five') {
      die.status = 'open';
      die.scoreAs = set;
    } else {
      _.each(this.dice, (x, ii) => {
        if (s.indexOf(ii) >= 0) {
          x.status = 'open';
          x.scoreAs = set;
        }
      });
    }
    this.turn.rollScore -= this.getSetObject(set, die).points;
  }

  private scoreDice (autoScore: string | boolean): void {
    this.phase = 'score';
    if (_.isString(autoScore)) {
      if (autoScore === 'farkle') {
        this.phase = 'farkle';
        this.openMessage('farkle');
      } else {
        this.phase = 'full';
        this.openMessage({
          type: 'full',
          data: _.extend({ set: autoScore }, this.getSetObject(autoScore))
        });
      }
    }
  }

  private addToScoreSets(set: string, indexes: number[]): void {
    this.scoreSets[set] = indexes;
  }

  private getSetObject (set: string, die?: Die): { noun: string; points: number } {
    return {
      'straight': { noun: 'A Straight', points: 1000},
      '3pair': { noun: 'Three Pair', points: 1500},
      '2triple': { noun: 'Two Triples', points: 2500},
      '6set': { noun: 'A set of 6', points: 3000},
      '5set': { noun: 'A set of 5', points: 2000},
      '4set': { noun: 'A set of 4', points: 1000},
      'triple': { noun: 'A Triple', points: die.value === 1 ? 300 : die.value * 100},
      'one': { noun: 'A Single', points: 100 },
      'five': { noun: 'A Single', points: 50 }
    }[set];
  }

  private openMessage (msg: string | { type: string; data: {} }): void {
    if (_.isString(msg)) {
      this.message.type = msg;
    } else {
      this.message = msg;
    }
  }

  private closeMessage (): void {
    this.message = { type: '' };
  }

  private setRollVal (x: Die): void {
    x.value = Math.floor(Math.random() * 6) + 1;
  }
}

interface Die {
  value: number;
  status: string; // held, used, open
  scoreAs: string;
}
