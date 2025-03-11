import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { IonicModule } from '@ionic/angular';
import { ProfileRoutingModule } from './profile-routing.module';



@NgModule({
  declarations: [ProfileComponent],
    imports: [
      CommonModule,
      IonicModule,
      ProfileRoutingModule
    ],
  exports : [ProfileComponent]
})
export class ProfileModule { }
