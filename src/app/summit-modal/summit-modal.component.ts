import { Component, OnInit } from '@angular/core';
import { Summit } from '../models/ISummit';
import { ModalController } from '@ionic/angular';
import { SummitService } from '../services/summit/summit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summit-modal',
  templateUrl: './summit-modal.component.html',
  styleUrls: ['./summit-modal.component.scss'],
})
export class SummitModalComponent  implements OnInit {


  protected summit!: Summit

  constructor(private modalCtrl: ModalController, private summitService: SummitService, private router:Router) { }

  ngOnInit() {
    this.summitService.getExtractFromWikipedia(this.summit.name).subscribe(() => {
      this.summit.photoUrl = this.summitService.summitImageUrl$.getValue()
      this.summit.wikiDescription = this.summitService.summitWikiDescription$.getValue()
    })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  displayDetails(summit: Summit) {
    this.router.navigateByUrl(`/summitlist/summit-detail/${summit.id}`).finally(() => this.cancel())
  }

}
