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
import { AuthenticationService } from '../auth/authentication.service';
import { UtilsService } from '../utils/utils.service';
import { InfiniteScrollCustomEvent, IonSelectCustomEvent, SelectChangeEventDetail } from '@ionic/core';

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

  public favorites$ = new BehaviorSubject<Summit[]>([]);

  /**Observable de l'image principale d'un sommet */
  public summitImageUrl$ = new BehaviorSubject<string>('');

  /**Observable de la description wikipedia (extrait) d'un sommet */
  public summitWikiDescription$ = new BehaviorSubject<string>('');

  /**Observable du lien de l'article wikipedia d'un sommet */
  public summitWikiPage$ = new BehaviorSubject<string>('');

  public result!: string;

  protected lastSortCriteria?: string

  /**URL de base pour requêtes API Wikipédia */
  private baseWikipediaUrl =
    'https://fr.wikipedia.org/api/rest_v1/page/summary/';

  private addFavoritesUrl : string = `${environment.restWebServiceUrl}rest/user/favorites`;

  constructor(private http: HttpClient, private authService : AuthenticationService, private utilsService : UtilsService) {}

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
  getAllFavorites(): BehaviorSubject<Summit[]> {
    let favorites : Summit[] = this.summitList$.getValue().filter((sum) => this.authService.userInfo$.getValue().favorites?.includes(sum.id)).map((sum) => sum)
    this.favorites$.next(favorites)
    return this.favorites$;
  }

  /**
   * Ajoute ou supprime un sommet de la liste des favoris d'un utilisateur
   * @param summit
   */

  manageFavorites(favoriteToManage : FavoriteToAdd){
    if (favoriteToManage.favoriteSummitId){
      if (!this.checkIfFavorite(favoriteToManage.favoriteSummitId)){
        console.log("posting")
        return this.http.post(`${this.addFavoritesUrl}/add`, favoriteToManage).pipe(
          tap(() => {
            if (favoriteToManage.favoriteSummitId){
              if (this.authService.userInfo$.getValue().favorites ){
                this.authService.userInfo$.getValue().favorites?.push(favoriteToManage.favoriteSummitId)
              } else {
                this.authService.userInfo$.getValue().favorites = [favoriteToManage.favoriteSummitId]
              }
            }
          })
        )
      } else {
        console.log("deleting")
        const username = this.authService.userInfo$.getValue().username
        return this.http.delete(`${environment.restWebServiceUrl}rest/user/${username}/favorites/delete/${favoriteToManage.favoriteSummitId}`).pipe(
          tap(() => {
            if (favoriteToManage.favoriteSummitId){
              const userInfo  = this.authService.userInfo$.getValue()
              if (userInfo.favorites){
                const favorites = userInfo.favorites;
                favorites.splice(favorites.indexOf(favoriteToManage.favoriteSummitId), 1)
                this.getAllFavorites().subscribe()
              }
            }
          })
        )
      }
    }
    return new Observable();
  }

  checkIfFavorite(favoriteId:string):boolean{
    return this.authService.userInfo$.getValue().favorites?.includes(favoriteId) ?? false;
  }



  /**
   * Renvoie la liste des url d'icônes de sites de randonnée
   * @returns
   */
  getThumbnailsSrc() {
    return this.thumbnails;
  }

  handleChangeOnSort($event?: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
      $event ? this.lastSortCriteria = $event.detail.value : this.lastSortCriteria
      this.summitList$.pipe(map((sum) => {
        let sortedList = [...sum];
        switch (this.lastSortCriteria) {
          case "altitude":
            return sortedList.sort((a,b) => this.utilsService.elevationSummitSorter(a,b))
          case "massif":
            return sortedList.sort((a,b) => this.utilsService.massifSummitSorter(a,b))
          default:
            return sortedList.sort((a,b) => this.utilsService.ascendingSummitSorter(a,b))
        }
      }))
    }

    loadMoreSummits(ev : InfiniteScrollCustomEvent) {
        this.loadMoreOfSummitList(this.summitList$).pipe(
          tap((sum) =>{
            this.handleChangeOnSort();
            this.summitList$.next(sum)
          })
        )
        setTimeout(() => ev.target.complete(), 500)
      }
}
