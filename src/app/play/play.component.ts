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
  dice: Array<{ value: number, held: boolean }>;
  turn: Turn;
  phase: string;
  message: { str: string, in: boolean };

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    // check for game
    if (!this.gameService.hasPlayers()) {
      this.router.navigate(['/newgame']);
      return;
    }
    // make dice
    this.dice = [];
    for (let i = 1; i <= 6; i++) {
      this.dice.push({
        value: 0,
        held: false
      });
    };
    // start the current turn
    this.message = { str: '', in: false };
    this.phase = 'start';
    this.turn = this.gameService.nextTurn();
    this.openMessage('When you are ready, click ROLL!');
  }

  roll () {
    this.phase = 'roll';
    this.closeMessage();
    _.chain(this.dice)
      .filter(x => !x.held)
      .each(this.setRollVal)
    ;
    const [score, msg] = this.checkRoll();
    this.openMessage(msg);
  }

  hold (die) {
    die.held = !die.held;
  }

  private checkRoll (): [number, string] {
    const faces = [1, 2, 3, 4, 5, 6];
    const dice = _.chain(this.dice)
      .filter(x => !x.held)
      .map(x => x.value)
      .value()
      .sort()
    ;

    // analyze the dice
    const counts = _.reduce(faces, (o, face) => {
      o[face] = 0;
      _.each(dice, die => { if (die === face) { o[face]++; } });
      return o;
    }, {});
    const pairs = _.filter(counts, x => x === 2);
    const triples = _.filter(counts, x => x === 3);
    const quads = _.filter(counts, x => x === 4);
    const pents = _.filter(counts, x => x === 5);
    const fullset = _.filter(counts, x => x === 6);
    console.log( 'counts:', counts, '\npairs:', pairs, 'triples:', triples, 'quads:', quads, 'pents:', pents, 'fullset:', fullset);

    // find full score patterns
    if (_.isEqual(dice, faces)) { return [1000, 'straight']; }
    if (dice.length === 6 && pairs.length === 3) { return [1500, '3pair']; }
    if (dice.length === 6 && triples.length === 2) { return [2500, '2triple']; }
    if (dice.length === 6 && fullset.length === 1) { return [3000, '6set']; }
    if (dice.length === 5 && pents.length === 1) { return [2000, '5set']; }
    if (dice.length === 4 && quads.length === 1) { return [1000, '4set']; }
    if (dice.length === 3 && triples.length === 1) { return [3000, 'triple']; }

    console.log('no score');
    return [0, ''];
  }

  private openMessage (msg): void {
    if (!msg) { return; }
    this.message.str = msg;
    this.message.in = true;
  }

  private closeMessage (): void {
    this.message.in = false;
  }

  private setRollVal (x): void {
    x.value = Math.floor(Math.random() * 6) + 1;
  }
}
