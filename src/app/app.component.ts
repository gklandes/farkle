import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  showHeader: boolean;

  constructor(
    private router: Router,
    private detector: ChangeDetectorRef
  ) {}

  ngOnInit () {
    console.log(this.detector);
    const d = this.detector;
    this.showHeader = true;
    this.router.navigate(['']);
    this.router.events.subscribe(function (event) {
      console.log('inside', d);
      if (event instanceof NavigationEnd) { 
        this.showHeader = event.url === '/';
        d.detectChanges();
        console.log(event.url, this.showHeader);
      };
    });
  }

}
