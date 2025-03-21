import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';
import { SummitService } from '../services/summit/summit.service';
import { Summit } from '../models/ISummit';
import { InfiniteScrollCustomEvent, SelectChangeEventDetail, ToastController } from '@ionic/angular';
import { map, Observable, tap } from 'rxjs';
import { IonSelectCustomEvent } from '@ionic/core';
import { AuthenticationService } from '../services/auth/authentication.service';

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
  protected summitList$ = new Observable<Summit[]>();

  protected lastSortCriteria?: string

  protected isEmpty!: boolean

  // protected isAuthenticated$ = new Observable<boolean>();

  constructor(private utilsService: UtilsService, protected router: Router, private summitService: SummitService, private toastCtrl: ToastController, private authService: AuthenticationService) { }

  /**
   * Initialise le titre et le contenu de la page
   */
  ngOnInit() {
    this.title = this.utilsService.getTitleFromUrl(this.router.url)
    this.router.url.includes('favorites') ? this.summitList$ = this.summitService.getAllFavorites().pipe(tap((summits) => this.isEmpty = summits.length == 0)) : this.summitList$ = this.summitService.getSummitList(50);
  }

  /**
   * Navigue vers le component d'affichage des informations détaillées d'un sommetC
   * @param summit
   */
  showDetail(summit: Summit) {
    this.router.navigateByUrl(`summitlist/summit-detail/${summit.id}`)
  }

  loadMoreSummits(ev : InfiniteScrollCustomEvent) {
    this.summitList$ = this.summitService.loadMoreOfSummitList(this.summitList$).pipe(
      tap(() =>{
        this.handleChangeOnSort();
      })
    )
    setTimeout(() => ev.target.complete(), 500)
    // this.summitService.loadMoreSummits(ev)
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

