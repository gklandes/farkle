    import { Component, OnInit } from '@angular/core';
    import { Router, NavigationEnd } from '@angular/router';

    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html'
    })
    export class AppComponent implements OnInit {
      showHeader: boolean;

      constructor(
        private router: Router
      ) {}

      ngOnInit () {
        this.showHeader = false;
        // this.router.navigate(['']);
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.showHeader = event.url !== '/';
          };
        });
      }
    }
