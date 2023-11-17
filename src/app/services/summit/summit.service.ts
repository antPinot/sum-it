import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Summit } from 'src/app/models/ISummit';

@Injectable({
  providedIn: 'root'
})
export class SummitService {

  private summitList : Summit [] = [
    {id: "1",name: 'Mont Blanc', altitude : 4806, massif: 'Alpes'},
    {id: "2",name: 'Pointe Dufour', altitude : 4634, massif: 'Monte Rosa', coordinates: latLng(45.9369096, 7.866751)},
    {id: "3",name: 'Pic du marboré', altitude : 3251, massif: 'Mont-Perdu', coordinates: latLng(42.70874, 0.02232)},
    {id: "4",name: 'Cime du Gélas', altitude : 3143, massif: 'Mercantour', coordinates: latLng(44.12278, 7.38389)},
    {id: "5",name: 'Cime de la Malédie', altitude : 3059, massif: 'Mercantour', coordinates: latLng(44.1222, 7.39833)},
    {id: "6",name: 'Mont Clapier', altitude : 3045, massif: 'Mercantour', coordinates: latLng(44.11487, 7.41968),
    linksUrl: ['https://www.visorando.com/randonnee-mont-clapier/', 'https://www.altituderando.com/Mont-Clapier-3045m', 'https://www.camptocamp.org/routes/45247/fr/mont-clapier-tour-et-sommet'],
    photoGallery: ['https://www.visorando.com/images/inter/m-sommet-du-mont-clapier-visorando-388442.jpg', 'https://www.visorando.com/images/inter/m-montee-finale-du-mont-clapier-visorando-388445.jpg',
    'https://www.altituderando.com/IMG/jpg/8/8/f/vallon.jpg']},
    {id: "7",name: 'Mont Ténibre', altitude : 3031, massif: 'Mercantour', coordinates: latLng(44.28374, 6.97171)},
  ]

  constructor(private http:HttpClient) { }

  public summitImageUrl$ = new BehaviorSubject<string>('');

  public summitWikiDescription$ = new BehaviorSubject<string>('');

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

}
