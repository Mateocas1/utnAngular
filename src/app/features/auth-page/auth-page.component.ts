import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type AuthTab = 'login' | 'register';

type LoginFormModel = {
  email: FormControl<string>;
  password: FormControl<string>;
};

type RegisterFormModel = {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

const AUTH_COPY = {
  title: 'Bienvenido a Chat App',
  subtitle: 'Ingresá con tu cuenta o creá una nueva para comenzar.',
  loginTab: 'Iniciar sesión',
  registerTab: 'Crear cuenta',
  loginButton: 'Ingresar',
  registerButton: 'Crear cuenta',
} as const;

function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim() ? null : { requiredTrimmed: true };
}

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly copy = AUTH_COPY;
  readonly activeTab = signal<AuthTab>('login');
  readonly feedback = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly isLoginTab = computed(() => this.activeTab() === 'login');

  readonly loginForm = new FormGroup<LoginFormModel>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.required],
    }),
  });

  readonly registerForm = new FormGroup<RegisterFormModel>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.required, Validators.minLength(8)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [requiredTrimmed, Validators.required, Validators.minLength(8)],
    }),
  }, { validators: [passwordsMatchValidator] });

  setTab(tab: AuthTab): void {
    this.activeTab.set(tab);
    this.feedback.set(null);
  }

  submitLogin(): void {
    if (this.isSubmitting()) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const result = this.authService.login({
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    });

    this.isSubmitting.set(false);

    if (!result.ok) {
      this.feedback.set(result.message ?? 'No se pudo iniciar sesión.');
      return;
    }

    this.feedback.set(null);
    this.router.navigate(['/chats']);
  }

  submitRegister(): void {
    if (this.isSubmitting()) return;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const result = this.authService.register({
      name: this.registerForm.controls.name.value,
      email: this.registerForm.controls.email.value,
      password: this.registerForm.controls.password.value,
    });

    this.isSubmitting.set(false);

    if (!result.ok) {
      this.feedback.set(result.message ?? 'No se pudo crear la cuenta.');
      return;
    }

    this.feedback.set(null);
    this.router.navigate(['/chats']);
  }

  get loginEmailError(): string | null {
    return this.resolveControlError(this.loginForm.controls.email, 'email');
  }

  get loginPasswordError(): string | null {
    return this.resolveControlError(this.loginForm.controls.password, 'password');
  }

  get registerNameError(): string | null {
    return this.resolveControlError(this.registerForm.controls.name, 'name');
  }

  get registerEmailError(): string | null {
    return this.resolveControlError(this.registerForm.controls.email, 'email');
  }

  get registerPasswordError(): string | null {
    return this.resolveControlError(this.registerForm.controls.password, 'password');
  }

  get registerConfirmPasswordError(): string | null {
    const control = this.registerForm.controls.confirmPassword;
    const mismatch = this.registerForm.hasError('passwordsMismatch') && (control.touched || control.dirty);
    if (mismatch) return 'Las contraseñas no coinciden.';
    return this.resolveControlError(control, 'password');
  }

  private resolveControlError(
    control: FormControl<string>,
    field: 'name' | 'email' | 'password'
  ): string | null {
    if (!(control.touched || control.dirty) || !control.errors) return null;

    if (control.errors['required'] || control.errors['requiredTrimmed']) {
      if (field === 'name') return 'Completá tu nombre.';
      if (field === 'email') return 'Completá tu email.';
      return 'Completá tu contraseña.';
    }

    if (control.errors['email']) return 'Ingresá un email válido.';
    if (control.errors['minlength']) {
      return field === 'name'
        ? 'El nombre debe tener al menos 2 caracteres.'
        : 'La contraseña debe tener al menos 8 caracteres.';
    }

    return null;
  }
}
