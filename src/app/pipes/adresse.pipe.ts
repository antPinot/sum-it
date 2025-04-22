import { Pipe, PipeTransform } from '@angular/core';
import { Adresse } from '../models/IAdresse';

@Pipe({
  name: 'adresse'
})
export class AdressePipe implements PipeTransform {

  transform(adresse:Adresse): string {
    if (adresse !== null) {
      return Object.entries(adresse).filter(([k,v]) => k !== 'point' && k !== undefined && v !== '' && v !== undefined).map(([k,v]) => v).join(', ')
    }
    return '';
  }

}
