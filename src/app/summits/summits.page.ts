import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';
import { SummitService } from '../services/summit/summit.service';
import { Summit } from '../models/ISummit';
import { InfiniteScrollCustomEvent, SelectChangeEventDetail, ToastController } from '@ionic/angular';
import { BehaviorSubject, map, Observable, take, takeUntil, tap } from 'rxjs';
import { IonSelectCustomEvent } from '@ionic/core';

/**
 * Component matérialisant la liste de tous les sommets OU la liste des favoris
 */
@Component({
  selector: 'app-summits',
  templateUrl: './summits.page.html',
  styleUrls: ['./summits.page.scss'],
})
export class SummitsPage implements OnInit {

  /**Titre de la page */
  protected title!: string

  /**Liste de tous les sommets */
  protected summitList$ = new Observable<Summit[]>()

  /**Booléen permettant d'initialiser le component avec la liste de tous les sommets ou uniquement la liste des favoris */
  protected lastSortCriteria?: string

  constructor(private utilsService: UtilsService, private router: Router, private summitService: SummitService, private toastCtrl: ToastController) { }

  /**
   * Initialise le titre et le contenu de la page
   */
  ngOnInit() {
    this.title = this.utilsService.getTitleFromUrl(this.router.url)
    this.router.url.includes('favorites') ? this.summitList$ = this.summitService.getAllFavorites() : this.summitList$ = this.summitService.getSummitList(50);
  }

  /**
   * Navigue vers le component d'affichage des informations détaillées d'un sommetC
   * @param summit
   */
  showDetail(summit: Summit) {
    this.router.navigateByUrl(`summitlist/summit-detail/${summit.id}`)
  }

  /**
   * Ajoute un sommet aux favoris et notifie avec un toast en fond de page
   * @param summit
   */
  async addToFavorites(summit: Summit, event: Event) {
    this.summitService.addToFavorites(summit)
    event.stopPropagation();
    const toast = await this.toastCtrl.create({
      message: summit.isFavorite ? 'Ce sommet a été ajouté à vos favoris' : 'Ce sommet a été retiré de vos favoris',
      duration: 2000,
      position: 'bottom'
    })

    await toast.present();
  }

  /**
   * Récupère les icônes favoris des sommets et modifie l'icône en fonction
   * @param summit
   * @returns
   */
  favoriteIcon(summit: Summit): string {
    let name = ''
    summit.isFavorite ? name = 'heart' : name = 'heart-outline'
    return name
  }

  loadMoreSummits(ev : InfiniteScrollCustomEvent) {
    this.summitList$ = this.summitService.loadMoreOfSummitList(this.summitList$).pipe(
      tap(() =>{
        this.handleChangeOnSort();
      })
    )
    setTimeout(() => ev.target.complete(), 500)
  }

  handleChangeOnSort($event?: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    $event ? this.lastSortCriteria = $event.detail.value : this.lastSortCriteria
    this.summitList$ = this.summitList$.pipe(map((sum) => {
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

}
