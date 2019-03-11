import {Component} from '@angular/core';

@Component({
  selector: 'app-quit',
  templateUrl: './quit.component.html',
  styleUrls: ['./quit.component.scss']
})
export class QuitComponent {

  public constructor() {
  }

  public onQuit(): void {
    window.close();
  }
}
