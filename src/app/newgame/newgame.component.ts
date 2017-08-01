import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
// import { MdToolbarModule, MdInputModule } from '@angular/material';
import { GameService, Player } from '../game.service';
import * as _ from 'underscore';

// declare const _;

@Component({
  selector: 'app-setup',
  templateUrl: './newgame.component.html'
})
export class NewgameComponent implements OnInit {
  players: Player[];
  goal: number;

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.players = [];
    this.addPlayer();
    this.goal = 1000;
  }

  addPlayer() {
    this.players.push(new Player());
  }

  hasPlayers () {
    return !!(_.filter(this.players, (x: Player) => x.name !== '')).length;
  }

  startGame() {
    this.gameService.start(this.players, this.goal);
    this.router.navigate(['play']);
  }

}
