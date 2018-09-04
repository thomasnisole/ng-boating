import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { MenuComponent } from './component/menu/menu.component';
import {CoreModule} from './module/core/core.module';
import { LayoutComponent } from './component/layout/layout.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SharedModule} from './module/shared/shared.module';
import {SocketIoModule} from 'ngx-socket-io';
import {AppGuardService} from './service/app-guard.service';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LayoutComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    NgbModule,
    NgbModalModule,
    SharedModule,
    SocketIoModule.forRoot({
      url: 'http://localhost:80'
    }),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AppGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
