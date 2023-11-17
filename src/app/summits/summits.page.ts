import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';
import { SummitService } from '../services/summit/summit.service';
import { Summit } from '../models/ISummit';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-summits',
  templateUrl: './summits.page.html',
  styleUrls: ['./summits.page.scss'],
})
export class SummitsPage implements OnInit {

  protected title!: string

  protected summitList!: Summit[]

  protected isFavorite!: boolean

  constructor(private utilsService: UtilsService, private router:Router, private summitService: SummitService, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.title = this.utilsService.getTitleFromUrl(this.router.url)
    this.router.url.includes('favorites') ? this.isFavorite = true : this.isFavorite = false
    this.isFavorite ? this.summitList = this.summitService.getAllFavorites() : this.summitList = this.summitService.getSummitList();
  }

  showDetail(summit: Summit){
    this.router.navigateByUrl(`summitlist/summit-detail/${summit.id}`)
  }

  async addToFavorites(summit: Summit){
    this.summitService.addToFavorites(summit)
    const toast = await this.toastCtrl.create({
      message: summit.isFavorite ? 'Ce sommet a été ajouté à vos favoris' : 'Ce sommet a été retiré de vos favoris',
      duration: 2000,
      position : 'bottom'
    })

    await toast.present();
  }

  favoriteIcon(summit: Summit) : string{
    let name = ''
    summit.isFavorite ? name = 'heart' : name ='heart-outline'
    return name
  }

}
