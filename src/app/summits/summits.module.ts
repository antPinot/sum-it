import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SummitsPageRoutingModule } from './summits-routing.module';

import { SummitsPage } from './summits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummitsPageRoutingModule
  ],
  declarations: [SummitsPage]
})
export class SummitsPageModule {}
