import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  protected title!: string

  constructor(private utilsService: UtilsService, private router:Router) { }

  ngOnInit() {
    this.title = this.utilsService.getTitleFromUrl(this.router.url)
  }

}
