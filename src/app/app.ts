import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast';
import { KeyboardShortcutsComponent } from './shared/components/keyboard-shortcuts/keyboard-shortcuts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, KeyboardShortcutsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'utec-diagramas';
}
