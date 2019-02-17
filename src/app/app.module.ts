import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MenuComponent} from './component/menu/menu.component';
import {CoreModule} from './module/core/core.module';
import {LayoutComponent} from './component/layout/layout.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SharedModule} from './module/shared/shared.module';
import {UserPreferencesGuard} from './module/system/guard/user-preferences.guard';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {SystemModule} from './module/system/system.module';

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
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SystemModule
  ],
  providers: [
    UserPreferencesGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
