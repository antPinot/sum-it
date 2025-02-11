import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SummitModalComponent } from '../summit-modal/summit-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LeafletModule,
  ],
  declarations: [HomePage, SummitModalComponent]
})
export class HomePageModule {}
