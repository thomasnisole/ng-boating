import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dial',
  templateUrl: './dial.component.html',
  styleUrls: ['./dial.component.scss']
})
export class DialComponent implements OnInit {

  @Input()
  public header: string;

  @Input()
  public footer: string;

  public constructor() { }

  public ngOnInit(): void {
  }

}
