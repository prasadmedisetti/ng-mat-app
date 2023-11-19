import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter();
  isAuth$!: Observable<boolean>;
  userEmail$!: Observable<string | null>;

  constructor(
    private authSvc: AuthService,
    private store: Store<{ AUTH: fromRoot.State }>
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    this.userEmail$ = this.store.select(fromRoot.getUserEmail);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authSvc.logout();
    this.onClose();
  }
}
