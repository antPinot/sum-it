import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdressePipe } from './adresse.pipe';



@NgModule({
  declarations: [AdressePipe],
  imports: [
    CommonModule
  ],
  exports : [
    AdressePipe
  ]
})
export class PipesModule { }
