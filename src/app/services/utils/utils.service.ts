import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private allRoutes = [
    { title: 'Accueil', url: '/folder/home', icon: 'home-outline' },
    { title: 'Liste des sommets', url: '/folder/summitlist', icon: 'triangle-outline' },
    { title: 'Favoris', url: '/folder/favorites', icon: 'heart-outline' },
  ];

  constructor() { }

  getAllRoutes(){
    return this.allRoutes
  }

  getTitleFromUrl(url: string): string{
    return this.allRoutes.filter((r) => r.url.includes(url)).map((r) => r.title).reduce(t => t)
  }
  

}
