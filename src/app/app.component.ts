import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input() dieValue = 1;

  onDieChange (val) {
    if (val <= 6 && val >= 1) {
      this.dieValue = val;
    }
  }
}
