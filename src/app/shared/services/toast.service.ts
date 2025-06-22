import { Injectable, signal } from '@angular/core';
import { Toast } from '../components/toast/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);

  // Expose readonly signal for components
  public readonly toasts$ = this.toasts.asReadonly();

  success(title: string, message: string, duration = 5000) {
    this.addToast({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration = 7000) {
    this.addToast({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration = 6000) {
    this.addToast({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration = 5000) {
    this.addToast({ type: 'info', title, message, duration });
  }

  private addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };

    this.toasts.update((toasts) => [...toasts, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: string) {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
