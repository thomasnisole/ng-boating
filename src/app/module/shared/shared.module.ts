import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {CoordinateFieldComponent} from './component/coordinate-field/coordinate-field.component';
import {LatitudeFieldComponent} from './component/latitude-field/latitude-field.component';
import {Ng2FittextModule} from 'ng2-fittext/src/ng2-fittext.module';
import {LongitudeFieldComponent} from './component/longitude-field/longitude-field.component';
import {NgxTsSerializerModule} from 'ngx-ts-serializer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    Ng2FittextModule,
    NgxTsSerializerModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    CoordinateFieldComponent,
    FormsModule,
    HttpClientModule,
    LatitudeFieldComponent,
    LongitudeFieldComponent,
    Ng2FittextModule,
    TranslateModule
  ],
  declarations: [
    CoordinateFieldComponent,
    LatitudeFieldComponent,
    LongitudeFieldComponent
  ],
})
export class SharedModule {
}
