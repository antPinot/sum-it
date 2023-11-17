import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Summit } from 'src/app/models/ISummit';

@Injectable({
  providedIn: 'root'
})
export class SummitService {
  
  private thumbnails : string[] = [
    "../../assets/icon/Visorando.jpg",
    "../../assets/icon/altituderando.jpg",
    "../../assets/icon/camp2camp.png"
  ]

  private summitList : Summit [] = [
    {id: "1",name: 'Mont Blanc', altitude : 4806, massif: 'Alpes'},
    {id: "2",name: 'Pointe Dufour', altitude : 4634, massif: 'Monte Rosa', coordinates: latLng(45.9369096, 7.866751)},
    {id: "3",name: 'Pic du marboré', altitude : 3251, massif: 'Mont-Perdu', coordinates: latLng(42.70874, 0.02232)},
    {id: "4",name: 'Cime du Gélas', altitude : 3143, massif: 'Mercantour', coordinates: latLng(44.12278, 7.38389)},
    {id: "5",name: 'Cime de la Malédie', altitude : 3059, massif: 'Mercantour', coordinates: latLng(44.1222, 7.39833),
    linksUrl: ['https://www.visorando.com/randonnee-belvedere.html', 'https://www.altituderando.com/Cime-de-la-Maledie-3059m-par-la-voie-normale', 'https://www.camptocamp.org/waypoints/38635/fr/cime-de-la-maledie'],
    photoGallery: ['https://skitour.fr/photos_rep/1519/151920/qiJOx.jpg', 'https://media.camptocamp.org/c2corg-active/1525186961_1800584292MI.jpg', 'https://www.gemsa.fr/sites/default/files/cime_maledie_04.jpg'] },
    {id: "6",name: 'Mont Clapier', altitude : 3045, massif: 'Mercantour', coordinates: latLng(44.11487, 7.41968),
    linksUrl: ['https://www.visorando.com/randonnee-mont-clapier/', 'https://www.altituderando.com/Mont-Clapier-3045m', 'https://www.camptocamp.org/routes/45247/fr/mont-clapier-tour-et-sommet'],
    photoGallery: ['https://www.visorando.com/images/inter/m-sommet-du-mont-clapier-visorando-388442.jpg', 'https://www.visorando.com/images/inter/m-montee-finale-du-mont-clapier-visorando-388445.jpg',
    'https://www.altituderando.com/IMG/jpg/8/8/f/vallon.jpg']},
    {id: "7",name: 'Mont Ténibre', altitude : 3031, massif: 'Mercantour', coordinates: latLng(44.28374, 6.97171),
    linksUrl : ['https://www.visorando.com/randonnee-le-mont-tenibre-en-boucle-depuis-saint-e/', 'https://www.altituderando.com/Mont-Tenibre-3031m-par-le-refuge-de-Rabuons', 'https://www.camptocamp.org/waypoints/39699/fr/mont-tenibre'],
    photoGallery: ['https://media.camptocamp.org/c2corg-active/1548686662_1380864415BI.jpg', 'https://cdjrando06.fr/wp-content/uploads/2023/09/23-20230910_105025.jpg', 'https://www.altituderando.com/IMG/jpg/4/b/e/3_-_Tunnel_Energie.jpg']},
  ]

  constructor(private http:HttpClient) { }

  public summitImageUrl$ = new BehaviorSubject<string>('');

  public summitWikiDescription$ = new BehaviorSubject<string>('');

  public summitWikiPage$ = new BehaviorSubject<string>('');

  public result!: string

  private baseWikipediaUrl = 'https://fr.wikipedia.org/api/rest_v1/page/summary/'

  getSummitList(){
    return this.summitList;
  }

  getSummitById(id: string){
    return this.summitList.filter((s) => s.id === id).reduce((s) => s)
  }

  getExtractFromWikipedia(summitName: string) : Observable<any>{
    return this.http.get(`${this.baseWikipediaUrl}${summitName}`).pipe(tap((res : any) => {
      this.summitImageUrl$.next(res.originalimage.source)
      this.summitWikiDescription$.next(res.extract)
      this.summitWikiPage$.next(res.content_urls.mobile.page)
    })
      );
  }

  getCoordinates(): LatLng[]{
    let coordinatesList: LatLng [] = []
    this.summitList.forEach((s) => {
      if (s.coordinates != null)
        coordinatesList.push(s.coordinates)
    })
    return coordinatesList;
  }

  async summitModalToDisplay(latlng: LatLng){
    return Promise.resolve(this.summitList.filter((s) => s.coordinates != null).filter((s) => s.coordinates?.equals(latlng)).reduce(s=> s))
  }

  getAllFavorites(): Summit[]{
    return this.summitList.filter((s) => s.isFavorite === true)
  }

  addToFavorites(summit: Summit) {
    let summitToUpdate = this.getSummitById(summit.id)
    summitToUpdate.isFavorite ? !summitToUpdate.isFavorite : summitToUpdate.isFavorite = true
  }

  getThumbnailsSrc(){
    return this.thumbnails;
  }

}
