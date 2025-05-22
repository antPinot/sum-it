import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './auth-page/auth-page.component';

@NgModule({
  declarations: [AuthPageComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, AuthRoutingModule],
  exports: [AuthPageComponent],
})
export class AuthModule {}
