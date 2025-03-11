import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { LatLng, latLng } from 'leaflet';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
  tap,
} from 'rxjs';
import { FavoriteToAdd } from 'src/app/models/IFavoriteToAdd';
import { Summit } from 'src/app/models/ISummit';
import { environment } from 'src/environments/environment';

/**
 * Service fournissant des méthodes de manipulation des données
 * de sommets
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SummitService {
  /**Icônes vers sites de randonnée externes */
  private thumbnails: string[] = [
    '../../assets/icon/Visorando.jpg',
    '../../assets/icon/altituderando.jpg',
    '../../assets/icon/camptocamp.png',
  ];

  private baseUrl = `${environment.restWebServiceUrl}rest/peak/`;

  public summitList$ = new BehaviorSubject<Summit[]>([]);

  constructor(private http: HttpClient) {}

  /**Observable de l'image principale d'un sommet */
  public summitImageUrl$ = new BehaviorSubject<string>('');

  /**Observable de la description wikipedia (extrait) d'un sommet */
  public summitWikiDescription$ = new BehaviorSubject<string>('');

  /**Observable du lien de l'article wikipedia d'un sommet */
  public summitWikiPage$ = new BehaviorSubject<string>('');

  public result!: string;

  /**URL de base pour requêtes API Wikipédia */
  private baseWikipediaUrl =
    'https://fr.wikipedia.org/api/rest_v1/page/summary/';

  private getFavoritesUrl : string = `${environment.restWebServiceUrl}rest/peak/favorites`;

  private postFavoritesUrl : string = `${environment.restWebServiceUrl}rest/user/favorites`;

  /**
   * Renvoie la liste de tous les sommets
   *
   * @returns Liste de tous les sommets
   */
  getSummitList(limitResults?: number): Observable<Summit[]> {
    if (this.summitList$.getValue().length != 0) {
      return this.summitList$.pipe(
        map((s) => (limitResults ? s.slice(0, limitResults) : s))
      );
    }
    return this.http
      .get<Summit[]>(`${this.baseUrl}all`)
      .pipe(tap((summits) => this.summitList$.next(summits)));
  }

  loadMoreOfSummitList(
    currentObservable: Observable<Summit[]>
  ): Observable<Summit[]> {
    return currentObservable.pipe(
      map((obs) =>
        obs.concat(
          this.summitList$.getValue().slice(obs.length, obs.length + 50)
        )
      )
    );
  }

  /**
   * Recherche un sommet par id
   *
   * @param id id du sommet à rechercher
   * @returns sommet correspondant
   */
  getSummitById(id: string) {
    return this.summitList$.value.filter((s) => s.id === id).reduce((s) => s);
  }

  /**
   * Effectue une requête sur l'API Wikipédia pour récupérer l'image principale,
   * la description (extrait) et le lien de l'article wikipédia d'un sommet
   *
   * @param summitName nom du sommet
   * @returns
   */
  getExtractFromWikipedia(summit : Summit): Observable<any> {
    let query : string = ""
    summit.wikipediaUri != null ? query = summit.wikipediaUri : query = summit.name
    if (query.indexOf(':') != -1)
      query = query.substring(
        query.indexOf(':') + 1
      );
    return this.http.get(`${this.baseWikipediaUrl}${query}`).pipe(
      tap((res: any) => {
        if (res.title != 'Not found.') {
          this.summitImageUrl$.next(res.originalimage.source);
          this.summitWikiDescription$.next(res.extract);
          this.summitWikiPage$.next(res.content_urls.mobile.page);
        }
      })
    );
  }

  /**
   * Permet d'ouvrir un ion-modal avec les informations condensées d'un sommet
   *
   * @param latlng
   * @returns Promesse de sommet
   */
  async summitModalToDisplay(latlng: LatLng) {
    return Promise.resolve(
      this.summitList$.value
        .filter((s) =>
          L.latLng(s.geometry.coordinates[1], s.geometry.coordinates[0]).equals(
            latlng
          )
        )
        .reduce((s) => s)
    );
  }

  /**
   * Récupère la liste de tous les favoris
   * @returns Tableau de sommets
   */
  getAllFavorites(): Observable<Summit[]> {
    return this.http
      .get<Summit[]>(`${this.getFavoritesUrl}`)
      .pipe(tap((favorites) => this.summitList$.next(favorites)));
  }

  /**
   * Ajoute un sommet à la liste des favoris(modifie le booléen isFavorite)
   * @param summit
   */
  // addToFavorites(summit: Summit) {
  //   let updatedList = this.summitList$.value.map((s) => {
  //     if (s.id === summit.id)
  //       s.isFavorite ? (s.isFavorite = !s.isFavorite) : (s.isFavorite = true);
  //     return s;
  //   });
  //   this.summitList$.next(updatedList);
  // }

  // addToFavorites(summit:Summit) : Observable<Summit>{
  //   return this.http
  //     .post<Summit>(`${this.postFavoritesUrl}`, )
  //     .pipe(tap((favorite) => this.summitList$.getValue().push(favorite)));
  // }



  /**
   * Renvoie la liste des url d'icônes de sites de randonnée
   * @returns
   */
  getThumbnailsSrc() {
    return this.thumbnails;
  }

  // getInformationsFromOtherSources(summit : Summit) {
  //   if (summit.photoUrl){
  //     this.summitImageUrl$.next(summit.photoUrl);
  //     console.log(this.summitImageUrl$.value)
  //   }
  // }
}
