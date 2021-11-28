import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public cargando: boolean = false;
  public uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {
    if (this.form.invalid) { return; }

    this.store.dispatch(ui.isLoading());

    const { email, password } = this.form.value;

    this.authService.loginUsuario(email, password).then(() => {
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    }).catch(err => {
      this.store.dispatch(ui.stopLoading());

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      })
    });
  }

}
