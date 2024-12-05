import { Component, OnInit } from '@angular/core';
import { Summit } from '../models/ISummit';
import { ModalController } from '@ionic/angular';
import { SummitService } from '../services/summit/summit.service';
import { Router } from '@angular/router';

/**
 * Component matérialisant un ion-modal affichant les informations condensées d'un sommet
 *
 */
@Component({
  selector: 'app-summit-modal',
  templateUrl: './summit-modal.component.html',
  styleUrls: ['./summit-modal.component.scss'],
})
export class SummitModalComponent implements OnInit {
  /**Sommet dont les informations sont à afficher de façon condensée */
  protected summit!: Summit;

  constructor(
    private modalCtrl: ModalController,
    private summitService: SummitService,
    private router: Router
  ) {}

  /**
   * Initialise le component avec l'extrait wikipédia et la photo générale du sommet
   */
  ngOnInit() {
    let wikipediaQuery : string = ""
    this.summit.wikipediaUri != null ? wikipediaQuery = this.summit.wikipediaUri : wikipediaQuery = this.summit.name
    this.summitService.getExtractFromWikipedia(wikipediaQuery)
        .subscribe(() => {
          this.summit.photoUrl = this.summitService.summitImageUrl$.getValue();
          this.summit.wikiDescription =
            this.summitService.summitWikiDescription$.getValue();
        });
    }


  /**
   * Annule
   * @returns
   */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
   * Confirme
   * @returns
   */
  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  /**
   * Navigue vers le component affichant les informations détaillées du sommet et ferme le ion-modal
   * @param summit
   */
  displayDetails(summit: Summit) {
    this.router
      .navigateByUrl(`/summitlist/summit-detail/${summit.id}`)
      .finally(() => this.cancel());
  }
}
