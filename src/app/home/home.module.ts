import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { SummitModalComponent } from '../summit-modal/summit-modal.component';
import { PipesModule } from '../pipes/pipes.module';
import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LeafletModule,
    PipesModule
  ],
  declarations: [HomePage, SummitModalComponent]
})
export class HomePageModule {}
