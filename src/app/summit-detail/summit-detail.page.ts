import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Summit } from '../models/ISummit';
import { SummitService } from '../services/summit/summit.service';
import { register } from 'swiper/element/bundle';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-summit-detail',
  templateUrl: './summit-detail.page.html',
  styleUrls: ['./summit-detail.page.scss'],
})
export class SummitDetailPage implements OnInit {

  @Input()
  protected summit!: Summit

  protected isFavorite : boolean = false

  protected takenPicture!: Photo

  constructor(private activatedRoute:ActivatedRoute, private summitService: SummitService) { }

  ngOnInit() {
    this.summit = this.summitService.getSummitById(this.activatedRoute.snapshot.paramMap.get('id') as string)
    this.summitService.getExtractFromWikipedia(this.summit.name).subscribe(() => {
      this.summit.photoUrl = this.summitService.summitImageUrl$.getValue()
      this.summit.wikiDescription = this.summitService.summitWikiDescription$.getValue()
      register();
    })
  }

  favoriteIcon() : string{
    let name = ''
    this.isFavorite ? name = 'heart' : name ='heart-outline'
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
    this.isFavorite = !this.isFavorite
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async openInAppBrowser(urlToOpen: string){
    await Browser.open({ url: urlToOpen });
  }
  

}
