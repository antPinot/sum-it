import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Summit } from '../models/ISummit';
import { SummitService } from '../services/summit/summit.service';
import { register } from 'swiper/element/bundle';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';
import {
  AlertController,
  PopoverController,
} from '@ionic/angular';
import { GalleryModalComponent } from '../gallery-modal/gallery-modal.component';
import { Location } from '@angular/common';
import { of } from 'rxjs';

export const summitDetailResolver: ResolveFn<Summit> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const summitService = inject(SummitService);

  const summit = summitService.getSummitById(
    route.paramMap.get('id') as string
  );
  if (
    summit.photoUrl == null ||
    summit.photoUrl == '' ||
    summit.wikipediaUri != null
  ) {
    summitService.getExtractFromWikipedia(summit).subscribe(() => {
      summit.photoUrl = summitService.summitImageUrl$.getValue();
      summit.wikiDescription = summitService.summitWikiDescription$.getValue();
      summit.wikipediaPage = summitService.summitWikiPage$.getValue();
    });
  }

  return of(summit);
};

/**
 * Component matérialisant un sommet et ses informations détaillées
 */
@Component({
  selector: 'app-summit-detail',
  templateUrl: './summit-detail.page.html',
  styleUrls: ['./summit-detail.page.scss'],
})
export class SummitDetailPage implements OnInit {
  /** Sommet dont les informations détaillées sont à afficher*/
  @Input()
  protected summit!: Summit;

  /**Photo capturée ou récupérée depuis le répertoire du téléphone (à ajouter à la gallerie) */
  protected takenPicture!: Photo;

  /**Liste des icônes de sites de randonnée */
  protected thumbnailsSrc!: string[];

  constructor(
    private activatedRoute: ActivatedRoute,
    protected summitService: SummitService,
    private alertCtrl: AlertController,
    private location: Location,
    private popoverCtrl: PopoverController
  ) {}

  /**
   * Initialise la photo générale, la déscription wikipédia (extrait), le lien vers l'article wikipédia du sommet et la liste des url des icônes de sites de randonnée
   */
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ summit }) => {
      this.summit = summit;
    });

    this.thumbnailsSrc = this.summitService.getThumbnailsSrc();
    //Méthode swiper.js (Requis pour le fonctionnement d'un swiper-container)
    register();
  }



  goBack() {
    this.location.back();
  }

  /**
   * Méthode permettant de faire appel au plugin Capacitor Camera pour réaliser une photo
   * ou récupérer une photo depuis un répertoire local
   */
  async takePicture() {
    this.takenPicture = await Camera.getPhoto({
      quality: 95,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
    }).then((photo) => {
      this.confirmAlert();
      return photo;
    });

    if (this.takenPicture.webPath != null) {
      this.summitService
        .getSummitById(this.summit.id)
        .photoGallery?.push(this.takenPicture.webPath);
    }
  }

  /**
   * Ouverture d'un ion-alert pour confirmer l'upload d'une photo
   */
  async confirmAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Votre photo a été ajoutée à la galerie',
      buttons: ['OK'],
    });
    await alert.present();
  }

  /**
   * Utilise le plugin Capacitor Browser pour ouvrir un navigateur web intra-application
   * @param urlToOpen url vers laquelle naviguer
   */
  async openInAppBrowser(urlToOpen: string) {
    if (urlToOpen != null) {
      await Browser.open({ url: urlToOpen });
    }
  }

  async enlargePictures(photoGalleryParam: string[]) {
    const popover = await this.popoverCtrl.create({
      component: GalleryModalComponent,
      componentProps: {
        photoGallery: photoGalleryParam,
      },
    });

    popover.style.cssText = 'size=cover';

    popover.present();
  }

  /**
   * Renvoie l'index de l'icône correspondant au lien
   * @param url
   * @returns
   */
  displayProperThumbnail(url: string): number {
    return this.thumbnailsSrc.findIndex((thumb) =>
      url
        .toLowerCase()
        .includes(
          thumb
            .substring(thumb.lastIndexOf('/') + 1, thumb.lastIndexOf('.'))
            .toLowerCase()
        )
    );
  }
}
