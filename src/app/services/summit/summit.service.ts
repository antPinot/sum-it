import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { LatLng, latLng } from 'leaflet';
import { BehaviorSubject, filter, from, map, mergeMap, Observable, tap } from 'rxjs';
import { Summit } from 'src/app/models/ISummit';

/**
 * Service fournissant des méthodes de manipulation des données
 * de sommets
 *
 */
@Injectable({
  providedIn: 'root'
})
export class SummitService {

  /**Icônes vers sites de randonnée externes */
  private thumbnails: string[] = [
    "../../assets/icon/Visorando.jpg",
    "../../assets/icon/altituderando.jpg",
    "../../assets/icon/camp2camp.png"
  ]

  private baseUrl = `http://localhost:8080/rest/peak/`;
  /** Liste des sommets */
  // private summitList: Summit[] = [
  //   { id: "1", name: 'Mont Blanc', altitude: 4806, massif: 'Alpes' },
  //   { id: "2", name: 'Pointe Dufour', altitude: 4634, massif: 'Monte Rosa', coordinates: latLng(45.9369096, 7.866751) },
  //   { id: "3", name: 'Pic du marboré', altitude: 3251, massif: 'Mont-Perdu', coordinates: latLng(42.70874, 0.02232) },
  //   { id: "4", name: 'Cime du Gélas', altitude: 3143, massif: 'Mercantour', coordinates: latLng(44.12278, 7.38389) },
  //   {
  //     id: "5", name: 'Cime de la Malédie', altitude: 3059, massif: 'Mercantour', coordinates: latLng(44.1222, 7.39833),
  //     linksUrl: ['https://www.visorando.com/randonnee-belvedere.html', 'https://www.altituderando.com/Cime-de-la-Maledie-3059m-par-la-voie-normale', 'https://www.camptocamp.org/waypoints/38635/fr/cime-de-la-maledie'],
  //     photoGallery: ['https://skitour.fr/photos_rep/1519/151920/qiJOx.jpg', 'https://media.camptocamp.org/c2corg-active/1525186961_1800584292MI.jpg', 'https://www.gemsa.fr/sites/default/files/cime_maledie_04.jpg']
  //   },
  //   {
  //     id: "6", name: 'Mont Clapier', altitude: 3045, massif: 'Mercantour', coordinates: latLng(44.11487, 7.41968),
  //     linksUrl: ['https://www.visorando.com/randonnee-mont-clapier/', 'https://www.altituderando.com/Mont-Clapier-3045m', 'https://www.camptocamp.org/routes/45247/fr/mont-clapier-tour-et-sommet'],
  //     photoGallery: ['https://www.visorando.com/images/inter/m-sommet-du-mont-clapier-visorando-388442.jpg', 'https://www.visorando.com/images/inter/m-montee-finale-du-mont-clapier-visorando-388445.jpg',
  //       'https://www.altituderando.com/IMG/jpg/8/8/f/vallon.jpg']
  //   },
  //   {
  //     id: "7", name: 'Mont Ténibre', altitude: 3031, massif: 'Mercantour', coordinates: latLng(44.28374, 6.97171),
  //     linksUrl: ['https://www.visorando.com/randonnee-le-mont-tenibre-en-boucle-depuis-saint-e/', 'https://www.altituderando.com/Mont-Tenibre-3031m-par-le-refuge-de-Rabuons', 'https://www.camptocamp.org/waypoints/39699/fr/mont-tenibre'],
  //     photoGallery: ['https://media.camptocamp.org/c2corg-active/1548686662_1380864415BI.jpg', 'https://cdjrando06.fr/wp-content/uploads/2023/09/23-20230910_105025.jpg', 'https://www.altituderando.com/IMG/jpg/4/b/e/3_-_Tunnel_Energie.jpg']
  //   },
  // ]

  /** Liste des sommets */
  // public summitList$ = new BehaviorSubject<Summit[]>([{ id: "1", name: 'Mont Blanc', altitude: 4806, massif: 'Alpes' },
  //   { id: "2", name: 'Pointe Dufour', altitude: 4634, massif: 'Monte Rosa', coordinates: latLng(45.9369096, 7.866751) },
  //   { id: "3", name: 'Pic du marboré', altitude: 3251, massif: 'Mont-Perdu', coordinates: latLng(42.70874, 0.02232) },
  //   { id: "4", name: 'Cime du Gélas', altitude: 3143, massif: 'Mercantour', coordinates: latLng(44.12278, 7.38389) },
  //   {
  //     id: "5", name: 'Cime de la Malédie', altitude: 3059, massif: 'Mercantour', coordinates: latLng(44.1222, 7.39833),
  //     linksUrl: ['https://www.visorando.com/randonnee-belvedere.html', 'https://www.altituderando.com/Cime-de-la-Maledie-3059m-par-la-voie-normale', 'https://www.camptocamp.org/waypoints/38635/fr/cime-de-la-maledie'],
  //     photoGallery: ['https://skitour.fr/photos_rep/1519/151920/qiJOx.jpg', 'https://media.camptocamp.org/c2corg-active/1525186961_1800584292MI.jpg', 'https://www.gemsa.fr/sites/default/files/cime_maledie_04.jpg']
  //   },
  //   {
  //     id: "6", name: 'Mont Clapier', altitude: 3045, massif: 'Mercantour', coordinates: latLng(44.11487, 7.41968),
  //     linksUrl: ['https://www.visorando.com/randonnee-mont-clapier/', 'https://www.altituderando.com/Mont-Clapier-3045m', 'https://www.camptocamp.org/routes/45247/fr/mont-clapier-tour-et-sommet'],
  //     photoGallery: ['https://www.visorando.com/images/inter/m-sommet-du-mont-clapier-visorando-388442.jpg', 'https://www.visorando.com/images/inter/m-montee-finale-du-mont-clapier-visorando-388445.jpg',
  //       'https://www.altituderando.com/IMG/jpg/8/8/f/vallon.jpg']
  //   },
  //   {
  //     id: "7", name: 'Mont Ténibre', altitude: 3031, massif: 'Mercantour', coordinates: latLng(44.28374, 6.97171),
  //     linksUrl: ['https://www.visorando.com/randonnee-le-mont-tenibre-en-boucle-depuis-saint-e/', 'https://www.altituderando.com/Mont-Tenibre-3031m-par-le-refuge-de-Rabuons', 'https://www.camptocamp.org/waypoints/39699/fr/mont-tenibre'],
  //     photoGallery: ['https://media.camptocamp.org/c2corg-active/1548686662_1380864415BI.jpg', 'https://cdjrando06.fr/wp-content/uploads/2023/09/23-20230910_105025.jpg', 'https://www.altituderando.com/IMG/jpg/4/b/e/3_-_Tunnel_Energie.jpg']
  //   },])

  public summitList$ = new BehaviorSubject<Summit[]>([]);

  constructor(private http: HttpClient) { }

  /**Observable de l'image principale d'un sommet */
  public summitImageUrl$ = new BehaviorSubject<string>('');

  /**Observable de la description wikipedia (extrait) d'un sommet */
  public summitWikiDescription$ = new BehaviorSubject<string>('');

  /**Observable du lien de l'article wikipedia d'un sommet */
  public summitWikiPage$ = new BehaviorSubject<string>('');

  public result!: string

  /**URL de base pour requêtes API Wikipédia */
  private baseWikipediaUrl = 'https://fr.wikipedia.org/api/rest_v1/page/summary/'

  /**
   * Renvoie la liste de tous les sommets
   *
   * @returns Liste de tous les sommets
   */
  getSummitList(limitResults?: number) : Observable<Summit[]> {
    if (this.summitList$.getValue().length != 0){
      return this.summitList$.pipe(map(s => limitResults ? s.slice(0,limitResults) : s))
    }
    return this.http.get<Summit[]>(`${this.baseUrl}all`).pipe(
      tap(summits => this.summitList$.next(summits)));
  }

  loadMoreOfSummitList(currentObservable : Observable<Summit[]>): Observable<Summit[]>{
    return currentObservable.pipe(map((obs) => obs.concat(this.summitList$.getValue().slice(obs.length, (obs.length + 50)))))
  }

  /**
   * Recherche un sommet par id
   *
   * @param id id du sommet à rechercher
   * @returns sommet correspondant
   */
  getSummitById(id: string) {
    return this.summitList$.value.filter((s) => s.id === id).reduce((s) => s)
  }

  /**
   * Effectue une requête sur l'API Wikipédia pour récupérer l'image principale,
   * la description (extrait) et le lien de l'article wikipédia d'un sommet
   *
   * @param summitName nom du sommet
   * @returns
   */
  getExtractFromWikipedia(wikipediaQuery: string): Observable<any> {
    if (wikipediaQuery.indexOf(":") != -1){
      wikipediaQuery = wikipediaQuery.substring(wikipediaQuery.indexOf(":") + 1);
      console.log(wikipediaQuery)
    }
    return this.http.get(`${this.baseWikipediaUrl}${wikipediaQuery}`).pipe(tap((res: any) => {
      this.summitImageUrl$.next(res.originalimage.source)
      this.summitWikiDescription$.next(res.extract)
      this.summitWikiPage$.next(res.content_urls.mobile.page)
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
    return Promise.resolve(this.summitList$.value.filter((s) => L.latLng(s.geometry.coordinates[1], s.geometry.coordinates[0]).equals(latlng)).reduce(s => s))
  }

  /**
   * Récupère la liste de tous les favoris
   * @returns Tableau de sommets
   */
  getAllFavorites(): Observable<Summit[]>{
    return this.summitList$.pipe(map((sum) => sum.filter((s) => s.isFavorite === true)));
  }

  /**
   * Ajoute un sommet à la liste des favoris(modifie le booléen isFavorite)
   * @param summit
   */
  addToFavorites(summit: Summit) {
    let updatedList = this.summitList$.value.map((s) =>  {
      if (s.id === summit.id)
        s.isFavorite ? s.isFavorite = !s.isFavorite : s.isFavorite = true
      return s
    })
    this.summitList$.next(updatedList)
  }

  /**
   * Renvoie la liste des url d'icônes de sites de randonnée
   * @returns
   */
  getThumbnailsSrc() {
    return this.thumbnails;
  }

}
