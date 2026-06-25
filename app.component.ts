import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false, // ❌ غیر-standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'patoogh';
}