import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteIconComponent } from './favorite-icon/favorite-icon.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [FavoriteIconComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[FavoriteIconComponent]
})
export class ComponentsModule { }
