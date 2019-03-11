import {Component, ViewChild} from '@angular/core';
import {ElectronService} from '../../module/system/service/electron.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @ViewChild('shutdownConfirmationContent')
  public modalShutdownConfirmationPopup;

  public constructor(private electronService: ElectronService, private modalService: NgbModal) {
  }

  public onQuit(): void {
    this.modalService.open(this.modalShutdownConfirmationPopup).result.then(
      (result) => {
        if (!result) {
          return;
        }

        this.electronService.childProcess.exec('sudo /sbin/shutdown -h 0');
      }
    );
  }
}
