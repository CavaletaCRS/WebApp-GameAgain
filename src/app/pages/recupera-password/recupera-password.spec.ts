import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../service/auth.service';
import { RecuperaPassword } from './recupera-password';

describe('RecuperaPassword', () => {
  const resetPassword = vi.fn();

  beforeEach(() => {
    resetPassword.mockReset().mockResolvedValue(undefined);
    TestBed.configureTestingModule({
      imports: [RecuperaPassword],
      providers: [provideRouter([]), { provide: AuthService, useValue: { resetPassword } }],
    });
  });

  afterEach(() => vi.useRealTimers());

  async function setup(email: string) {
    const fixture = TestBed.createComponent(RecuperaPassword);
    fixture.componentInstance.email = email;
    fixture.detectChanges();
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    return { fixture, form, component: fixture.componentInstance };
  }

  it('sends the email and displays confirmation for exactly three seconds', async () => {
    const { fixture, form, component } = await setup('utente@example.com');
    vi.useFakeTimers();
    await component.submit(form);
    fixture.detectChanges();
    expect(resetPassword).toHaveBeenCalledWith('utente@example.com');
    expect(fixture.nativeElement.querySelector('.reset-popup')).not.toBeNull();
    vi.advanceTimersByTime(2999);
    expect(component.showPopup()).toBe(true);
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.reset-popup')).toBeNull();
  });

  it('rejects invalid email addresses before requesting a reset', async () => {
    const { form, component } = await setup('email-non-valida');
    await component.submit(form);
    expect(resetPassword).not.toHaveBeenCalled();
    expect(component.errorMessage()).toBe('Inserisci un indirizzo email valido.');
  });

  it('shows an error without a success popup when sending fails', async () => {
    const { form, component } = await setup('utente@example.com');
    resetPassword.mockRejectedValue({ code: 'auth/network-request-failed' });
    await component.submit(form);
    expect(component.showPopup()).toBe(false);
    expect(component.errorMessage()).toContain('Errore di rete');
    expect(component.loading()).toBe(false);
  });
});
