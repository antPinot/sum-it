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
  ]

  public summitModalToDisplay!: Summit

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

  async summitModal(latlng: LatLng){
    return Promise.resolve(this.summitList.filter((s) => s.coordinates != null).filter((s) => s.coordinates?.equals(latlng)).reduce(s=> s))
  }

}
