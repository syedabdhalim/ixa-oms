import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ROLE_OPTIONS, Role } from '../../../shared/types/roles';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select'; // ✅ use Select
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message'; // ✅ single message

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    ButtonModule,
    DividerModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  roles = ROLE_OPTIONS.map((r) => ({
    ...r,
    labelFull: `${r.label} - ${r.description}`,
  }));

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: this.fb.nonNullable.control<Role>('Admin'),
  });

  submitting = false;

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const { email, password, role } = this.form.getRawValue();

    // mock login
    this.auth.login(email, password, role);
    // simple role-based landing (you can expand later)
    this.router.navigateByUrl('/');
  }
}
