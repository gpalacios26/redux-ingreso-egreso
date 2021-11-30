import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../model/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public tipo: string = 'ingreso';
  public cargando: boolean = false;
  public loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.loadingSubs = this.store.select('ui').subscribe(({ isLoading }) => this.cargando = isLoading);

    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.loadingSubs?.unsubscribe();
  }

  guardar() {
    if (this.form.invalid) { return; }

    this.store.dispatch(ui.isLoading());

    const { descripcion, monto } = this.form.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then(() => {
      this.form.reset();
      this.store.dispatch(ui.stopLoading());
      Swal.fire('Registro creado', descripcion, 'success');
    }).catch(err => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire('Error', err.message, 'error');
    });
  }

}
