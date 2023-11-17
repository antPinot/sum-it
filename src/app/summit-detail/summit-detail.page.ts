import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Summit } from '../models/ISummit';
import { SummitService } from '../services/summit/summit.service';
import { register } from 'swiper/element/bundle';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Browser } from '@capacitor/browser';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-summit-detail',
  templateUrl: './summit-detail.page.html',
  styleUrls: ['./summit-detail.page.scss'],
})
export class SummitDetailPage implements OnInit {

  @Input()
  protected summit!: Summit

  protected takenPicture!: Photo

  protected thumbnailsSrc!: string[]

  protected summitWikiPage!: string

  constructor(private activatedRoute:ActivatedRoute, private summitService: SummitService, private toastCtrl:ToastController) { }

  ngOnInit() {
    this.summit = this.summitService.getSummitById(this.activatedRoute.snapshot.paramMap.get('id') as string)
    this.summitService.getExtractFromWikipedia(this.summit.name).subscribe(() => {
      this.summit.photoUrl = this.summitService.summitImageUrl$.getValue()
      this.summit.wikiDescription = this.summitService.summitWikiDescription$.getValue()
      this.summitWikiPage = this.summitService.summitWikiPage$.getValue()
    })
    this.thumbnailsSrc = this.summitService.getThumbnailsSrc()
    register();
  }

  favoriteIcon() : string{
    let name = ''
    this.summit.isFavorite ? name = 'heart' : name ='heart-outline'
    return name
  }

  async takePicture(){
    this.takenPicture = await Camera.getPhoto({
      quality:95,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      saveToGallery: true
    })
  }

  async addFavorite() {
    this.summit.isFavorite ? this.summit.isFavorite = !this.summit.isFavorite : this.summit.isFavorite = true
    await Haptics.impact({ style: ImpactStyle.Medium });
    const toast = await this.toastCtrl.create({
      message: this.summit.isFavorite ? 'Ce sommet a été ajouté à vos favoris' : 'Ce sommet a été retiré de vos favoris',
      duration: 2000,
      position : 'bottom'
    })

    await toast.present();
  }

  async openInAppBrowser(urlToOpen: string){
    await Browser.open({ url: urlToOpen });
  }

}
