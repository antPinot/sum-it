import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
} from 'geojson';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Adresse } from 'src/app/models/IAdresse';
import { Summit } from 'src/app/models/ISummit';

/**
 * Service fournissant des méthodes utiles
 * (Ex: Récupération des routes)
 */
@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  /** Routes de navigation de l'application */
  private allRoutes = [
    {
      title: 'Accueil',
      url: '/home',
      icon: 'home-outline' },
    {
      title: 'Liste des sommets',
      url: '/summitlist',
      icon: 'triangle-outline',
    },
    {
      title: 'Favoris',
      url: '/favorites',
      icon: 'heart-outline'
    },
    {
      title: 'Mon Compte',
      url: '/profile',
      icon: 'person-outline'
    },
  ];

  /** URL de base de requêtage de l'API Photon pour l'autocomplétion*/
  private photonBaseUrl = 'https://photon.komoot.io/api/';

  /** Observable de la liste des adresses pour l'autocomplétion*/
  public listAdressesForAutocomplete$ = new BehaviorSubject<Adresse[]>([]);

  /** Coordonées de l'adresse saisie par l'utilisateur*/
  public coordinates$ = new BehaviorSubject<Point>({
    type: 'Point',
    coordinates: [],
  });

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les routes de l'application
   * @returns Tableau de routes
   */
  getAllRoutes() {
    return this.allRoutes;
  }

  /***
   * Récupère le titre d'une page en fonction d'un url
   * @param url route active
   * @returns Titre associé
   */
  getTitleFromUrl(url: string): string {
    return this.allRoutes
      .filter((r) => r.url.includes(url))
      .map((r) => r.title)
      .reduce((t) => t);
  }

  /**
   * Méthode pour l'autocomplétion
   *
   * @param userQuery
   * @returns
   */
  findByUserQueryWithPhotonAPI(
    userQuery: string
  ): Observable<FeatureCollection<Geometry, GeoJsonProperties>> {
    return this.http
      .get<FeatureCollection>(`${this.photonBaseUrl}?q=${userQuery}&limit=4`)
      .pipe(
        tap((photonResultsGEOJSON: FeatureCollection) => {
          let adressesResults: Adresse[] = [];
          photonResultsGEOJSON.features.forEach((singleResult: Feature) => {
            let adresse: Adresse = {
              name: singleResult.properties?.['name'],
              ville: singleResult.properties?.['city'],
              departement: singleResult.properties?.['county'],
              pays: singleResult.properties?.['country'],
            };
            if (singleResult.geometry.type === 'Point') {
              let coordinates: Point = {
                type: 'Point',
                coordinates: [
                  singleResult.geometry?.['coordinates'][0],
                  singleResult.geometry?.['coordinates'][1],
                ],
              };
              adresse.point = coordinates;
            }
            adressesResults.push(adresse);
          });
          this.listAdressesForAutocomplete$.next(adressesResults);
        })
      );
  }

  ascendingSummitSorter(a: Summit, b: Summit) {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  elevationSummitSorter(a: Summit, b: Summit) {
    if (a.elevation < b.elevation) return -1;
    if (a.elevation > b.elevation) return 1;
    return 0;
  }

  massifSummitSorter(a: Summit, b: Summit) {
    if (a.massif === undefined && b.massif === undefined) return 0;
    if (a.massif === undefined) return 1;
    if (b.massif === undefined) return -1;
    if (a.massif < b.massif) return -1;
    if (a.massif > b.massif) return 1;
    return 0;
  }
}
