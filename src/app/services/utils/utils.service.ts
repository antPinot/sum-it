import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private allRoutes = [
    { title: 'Accueil', url: '/home', icon: 'home-outline' },
    { title: 'Liste des sommets', url: '/summitlist', icon: 'triangle-outline' },
    { title: 'Favoris', url: '/favorites', icon: 'heart-outline' },
  ];

  constructor() { }

  getAllRoutes(){
    return this.allRoutes
  }

  getTitleFromUrl(url: string): string{
    return this.allRoutes.filter((r) => r.url.includes(url)).map((r) => r.title).reduce(t => t)
  }

  
  

}
