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

  private pIndex: number;

  constructor(
    private gameService: GameService,
    private router: Router
  ) {
    this.dice = [];
    this.pIndex = 0;
  }

  ngOnInit() {
    console.log(this.gameService);
    if (!this.gameService.hasGame()) {
      this.router.navigate(['/newgame']);
      return;
    }

    for (let i = 1; i <= 6; i++) {
      this.dice.push({
        value: 0,
        held: false
      });
    };
    this.pIndex = 0;
    this.player = this.gameService.getPlayer(this.pIndex);
  }

  roll () {
    _.chain(this.dice)
      .filter(x => !x.held)
      .each(this.setRollVal)
    ;
      // .value();
  }

  hold (die){
    die.held = !die.held;
  }

  private setRollVal (x) {
    x.value = Math.floor(Math.random() * 6) + 1;
  }


}
