import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';
import { SummitService } from '../services/summit/summit.service';
import { Summit } from '../models/ISummit';

@Component({
  selector: 'app-summits',
  templateUrl: './summits.page.html',
  styleUrls: ['./summits.page.scss'],
})
export class SummitsPage implements OnInit {

  protected title!: string

  protected summitList!: Summit[]

  protected isFavorite!: boolean

  constructor(private utilsService: UtilsService, private router:Router, private summitService: SummitService) { }

  ngOnInit() {
    this.title = this.utilsService.getTitleFromUrl(this.router.url)
    this.router.url.includes('favorites') ? this.isFavorite = true : this.isFavorite = false
    this.isFavorite ? this.summitList = this.summitService.getAllFavorites() : this.summitList = this.summitService.getSummitList();
  }

  showDetail(summit: Summit){
    this.router.navigateByUrl(`summitlist/summit-detail/${summit.id}`)
  }

  addToFavorites(summit: Summit){
    this.summitService.addToFavorites(summit)
  }

  favoriteIcon(summit: Summit) : string{
    let name = ''
    summit.isFavorite ? name = 'heart' : name ='heart-outline'
    return name
  }

  

}
