import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Adresse } from 'src/app/models/IAdresse';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private allRoutes = [
    { title: 'Accueil', url: '/home', icon: 'home-outline' },
    { title: 'Liste des sommets', url: '/summitlist', icon: 'triangle-outline' },
    { title: 'Favoris', url: '/favorites', icon: 'heart-outline' },
  ];

  private photonBaseUrl = 'https://photon.komoot.io/api/'

  public listAdressesForAutocomplete$ = new BehaviorSubject<string[]>([]);

  public coordinates$ = new BehaviorSubject<Point>({ type: 'Point', coordinates: [] })

  constructor(private http:HttpClient) { }

  getAllRoutes(){
    return this.allRoutes
  }

  getTitleFromUrl(url: string): string{
    return this.allRoutes.filter((r) => r.url.includes(url)).map((r) => r.title).reduce(t => t)
  }

  findByUserQueryWithPhotonAPI(userQuery: string): Observable<FeatureCollection<Geometry, GeoJsonProperties>> {
    return this.http.get<FeatureCollection>(`${this.photonBaseUrl}?q=${userQuery}`).pipe(
      tap((photonResultsGEOJSON: FeatureCollection) => {
        let adressesResults: Adresse[] = [];
        photonResultsGEOJSON.features.forEach((singleResult: Feature) => {
          let adresse: Adresse = {
            numero: singleResult.properties?.['housenumber'],
            voie: singleResult.properties?.['street'],
            codePostal: singleResult.properties?.['postcode'],
            ville: singleResult.properties?.['city'],
            departement: singleResult.properties?.['county'],
            pays: singleResult.properties?.['country']
          };
          adressesResults.push(adresse);
          if (singleResult.geometry.type === 'Point') {
            let coordinates: Point = {
              type: 'Point',
              coordinates: [singleResult.geometry?.['coordinates'][0], singleResult.geometry?.['coordinates'][1]]
            };
            this.coordinates$.next(coordinates);
          }
        })

        let adressesFormatted : string [] = []
        adressesResults.forEach((a) => adressesFormatted.push(this.displayAdresse(a)))
        this.listAdressesForAutocomplete$.next(adressesFormatted)
      }))
  }

  displayAdresse(adresse: Adresse): string {
    if (adresse !== null) {
      let complementNum: boolean;
      adresse.complementNumero ? complementNum = true : complementNum = false;
      return complementNum ? `${adresse.numero} ${adresse.complementNumero} ${adresse.voie} ${adresse.codePostal} ${adresse.ville} ${adresse.departement} ${adresse.pays} ` : `${adresse.numero} ${adresse.voie} ${adresse.codePostal} ${adresse.ville} ${adresse.departement} ${adresse.pays} `
    }
    return '';
  }
  
  

}
