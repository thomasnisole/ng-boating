import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dial',
  templateUrl: './dial.component.html',
  styleUrls: ['./dial.component.scss']
})
export class DialComponent implements OnInit {

  @Input()
  public header: string;

  private _body: string;

  @Input()
  public defaultBody: string = '';

  @Input()
  public footer: string;

  public constructor() { }

  public ngOnInit(): void {}

  @Input()
  public set body(value: string) {
    this._body = value;
  }

  public get body(): string {
    if (this._body && this._body !== '') {
      return this._body;
    } else {
      return this.defaultBody;
    }
  }
}
