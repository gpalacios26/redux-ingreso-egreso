import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public nombre: string = '';
  public userSubs: Subscription;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter(({ user }) => user != null)
      ).subscribe(({ user }) => this.nombre = user.nombre);
  }

  ngOnDestroy() {
    this.userSubs?.unsubscribe();
  }

}
