import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Summit } from '../models/ISummit';
import { SummitService } from '../services/summit/summit.service';
import { register } from 'swiper/element/bundle';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Browser } from '@capacitor/browser';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { GalleryModalComponent } from '../gallery-modal/gallery-modal.component';
import { Location } from '@angular/common';

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
  protected summit!: Summit

  /**Photo capturée ou récupérée depuis le répertoire du téléphone (à ajouter à la gallerie) */
  protected takenPicture!: Photo

  /**Liste des icônes de sites de randonnée */
  protected thumbnailsSrc!: string[]

  /**Lien wikipédia de l'article du sommet */
  protected summitWikiPage!: string

  constructor(private activatedRoute: ActivatedRoute, private summitService: SummitService, private toastCtrl: ToastController, private alertCtrl: AlertController, private location:Location, private popoverCtrl:PopoverController) { }

  /**
   * Initialise la photo générale, la déscription wikipédia (extrait), le lien vers l'article wikipédia du sommet et la liste des url des icônes de sites de randonnée
   */
  ngOnInit() {
    this.summit = this.summitService.getSummitById(this.activatedRoute.snapshot.paramMap.get('id') as string)
    if (this.summit.photoUrl == null || this.summit.photoUrl == ""){
      this.summitService.getExtractFromWikipedia(this.summit).subscribe(() => {
        this.summit.photoUrl = this.summitService.summitImageUrl$.getValue()
        this.summit.wikiDescription = this.summitService.summitWikiDescription$.getValue()
        this.summitWikiPage = this.summitService.summitWikiPage$.getValue()
      })
    }
    this.thumbnailsSrc = this.summitService.getThumbnailsSrc()
    //Méthode swiper.js (Requis pour le fonctionnement d'un swiper-container)
    register();
  }

  /**
   * Méthode permettant de modifier l'icône en fonction du statut (favori ou non) du sommet
   * @returns attribut de l'icône
   */
  favoriteIcon(): string {
    let name = ''
    this.summit.isFavorite ? name = 'heart' : name = 'heart-outline'
    return name
  }


  goBack(){
    this.location.back()
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
      saveToGallery: true
    }).then((photo) => {
      this.confirmAlert()
      return photo
    })

    if (this.takenPicture.webPath != null) {
      this.summitService.getSummitById(this.summit.id).photoGallery?.push(this.takenPicture.webPath)
    }

  }

  /**
   * Ouverture d'un ion-alert pour confirmer l'upload d'une photo
   */
  async confirmAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Votre photo a été ajoutée à la galerie',
      buttons: ['OK'],
    })
    await alert.present()
  }

  /**
   * Emet une vibration (plugin Capacitor Haptics) et affiche un toast en fond de page si un sommet est ajouté/retiré des favoris
   */
  async addFavorite() {
    this.summit.isFavorite ? this.summit.isFavorite = !this.summit.isFavorite : this.summit.isFavorite = true
    await Haptics.impact({ style: ImpactStyle.Medium });
    const toast = await this.toastCtrl.create({
      message: this.summit.isFavorite ? 'Ce sommet a été ajouté à vos favoris' : 'Ce sommet a été retiré de vos favoris',
      duration: 2000,
      position: 'bottom'
    })
    await toast.present();
  }

  /**
   * Utilise le plugin Capacitor Browser pour ouvrir un navigateur web intra-application
   * @param urlToOpen url vers laquelle naviguer
   */
  async openInAppBrowser(urlToOpen: string) {
    await Browser.open({ url: urlToOpen });
  }

  async enlargePictures(photoGalleryParam: string[]) {
    const popover = await this.popoverCtrl.create({
      component: GalleryModalComponent,
      componentProps:{
        photoGallery : photoGalleryParam
      },
    });

    popover.style.cssText = "size=cover"

    popover.present();
  }

  /**
   * Renvoie l'index de l'icône correspondant au lien
   * @param url
   * @returns
   */
  displayProperThumbnail(url:string) : number {
    return this.thumbnailsSrc.findIndex((thumb) =>url.toLowerCase().includes(thumb.substring(thumb.lastIndexOf('/') + 1 , thumb.lastIndexOf('.')).toLowerCase()))
  }

}
