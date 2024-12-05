import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Adresse } from 'src/app/models/IAdresse';

/**
 * Service fournissant des méthodes utiles
 * (Ex: Récupération des routes)
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  /** Routes de navigation de l'application */
  private allRoutes = [
    { title: 'Accueil', url: '/home', icon: 'home-outline' },
    { title: 'Liste des sommets', url: '/summitlist', icon: 'triangle-outline' },
    { title: 'Favoris', url: '/favorites', icon: 'heart-outline' },
  ];

  /** URL de base de requêtage de l'API Photon pour l'autocomplétion (NON IMPLEMENTE) */
  private photonBaseUrl = 'https://photon.komoot.io/api/'

  /** Observable de la liste des adresses pour l'autocomplétion (NON IMPLEMENTE) */
  public listAdressesForAutocomplete$ = new BehaviorSubject<Adresse[]>([]);

  /** Coordonées de l'adresse saisie par l'utilisateur (NON IMPLEMENTE) */
  public coordinates$ = new BehaviorSubject<Point>({ type: 'Point', coordinates: [] })

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les routes de l'application
   * @returns Tableau de routes
   */
  getAllRoutes() {
    return this.allRoutes
  }

  /***
   * Récupère le titre d'une page en fonction d'un url
   * @param url route active
   * @returns Titre associé
   */
  getTitleFromUrl(url: string): string {
    return this.allRoutes.filter((r) => r.url.includes(url)).map((r) => r.title).reduce(t => t)
  }

  /**
   * Méthode pour l'autocomplétion
   *
   * @param userQuery
   * @returns
   */
  findByUserQueryWithPhotonAPI(userQuery: string): Observable<FeatureCollection<Geometry, GeoJsonProperties>> {
    return this.http.get<FeatureCollection>(`${this.photonBaseUrl}?q=${userQuery}&limit=4`).pipe(
      tap((photonResultsGEOJSON: FeatureCollection) => {
        let adressesResults: Adresse[] = [];
        photonResultsGEOJSON.features.forEach((singleResult: Feature) => {
          let adresse: Adresse = {
            name:singleResult.properties?.['name'],
            ville: singleResult.properties?.['city'],
            departement: singleResult.properties?.['county'],
            pays: singleResult.properties?.['country'],
          };
          if (singleResult.geometry.type === 'Point') {
            let coordinates: Point = {
              type: 'Point',
              coordinates: [singleResult.geometry?.['coordinates'][0], singleResult.geometry?.['coordinates'][1]]
            };
            adresse.point = coordinates
          }
          adressesResults.push(adresse);
        })
        this.listAdressesForAutocomplete$.next(adressesResults)
      }))
  }

  /**
   * Méthode pour l'autocomplétion
   *
   * @param adresse
   * @returns
   */
  displayAdresse(adresse: Adresse): string {
    if (adresse !== null) {
      return Object.values(adresse).filter((v) => v).join(' ')
    }
    return '';
  }
}
