import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-die',
  template: `
<img src="assets/images/{{dieImg[dieValue-1]}}" height="{{dieSize}}" width="{{dieSize}}" *ngIf="dieValue">
`
})
export class DieComponent implements OnInit {

  dieImg: object;
  // dieValue: number;
  dieSelect: string;

  @Input() dieValue: number;
  @Input() dieSize: number;

  constructor() {
    this.dieImg = [
      'd1.svg',
      'd2.svg',
      'd3.svg',
      'd4.svg',
      'd5.svg',
      'd6.svg'
    ];
    this.dieValue = 1;
    this.dieSelect = this.dieImg[this.dieValue - 1];
  }

  ngOnInit() {
  }
}
