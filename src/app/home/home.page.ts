import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected title!: string

  constructor(private utilsService : UtilsService, private router:Router) {}

  ngOnInit(): void {
    this.title = this.utilsService.getTitleFromUrl(this.router.url)
  }



}
