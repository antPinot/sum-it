import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SummitDetailPageRoutingModule } from './summit-detail-routing.module';

import { SummitDetailPage } from './summit-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummitDetailPageRoutingModule
  ],
  declarations: [SummitDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SummitDetailPageModule {}
