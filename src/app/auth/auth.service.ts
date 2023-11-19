import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as AUTH from './auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingSvc: TrainingService,
    private uiSvc: UIService,
    private store: Store<{ AUTH: fromRoot.State }>
  ) {}

  initAuthListener() {
    this.uiSvc.showLoader();
    this.afAuth.authState.subscribe((user) => {
      this.uiSvc.hideLoader();
      if (user) {
        this.store.dispatch(
          new AUTH.SetAuthenticated({ userId: user.uid, userEmail: user.email })
        );
        user.email;
        this.router.navigate(['/training']);
      } else {
        this.store.dispatch(new AUTH.SetUnauthenticated());
        this.trainingSvc.cancelSubscriptions();
        this.router.navigate(['/signin']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiSvc.showLoader();
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        this.uiSvc.hideLoader();
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code,
          errorMessage = error.message;
        this.uiSvc.hideLoader();
        this.uiSvc.showSnackbar(errorMessage, 'Error');
      });
  }

  login(authData: AuthData) {
    this.uiSvc.showLoader();
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        this.uiSvc.hideLoader();
      })
      .catch((error) => {
        // Handle Errors here.
        this.uiSvc.hideLoader();
        const errorCode = error.code,
          errorMessage = error.message;
        if (errorCode === 'auth/invalid-login-credentials') {
          this.uiSvc.showSnackbar('Invalid username/password', 'Error');
        } else {
          this.uiSvc.showSnackbar(errorMessage, 'Error');
        }
      });
  }

  logout() {
    this.uiSvc.showLoader();
    this.afAuth.signOut();
    this.uiSvc.hideLoader();
  }
}
