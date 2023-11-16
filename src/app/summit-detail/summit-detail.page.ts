import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Summit } from '../models/ISummit';
import { SummitService } from '../services/summit/summit.service';

@Component({
  selector: 'app-summit-detail',
  templateUrl: './summit-detail.page.html',
  styleUrls: ['./summit-detail.page.scss'],
})
export class SummitDetailPage implements OnInit {

  @Input()
  protected summit!: Summit

  constructor(private activatedRoute:ActivatedRoute, private summitService: SummitService) { }

  ngOnInit() {
    this.summit = this.summitService.getSummitById(this.activatedRoute.snapshot.paramMap.get('id') as string)
    this.summitService.getExtractFromWikipedia(this.summit.name).subscribe(() => {
      this.summit.photoUrl = this.summitService.summitImageUrl$.getValue()
      this.summit.wikiDescription = this.summitService.summitWikiDescription$.getValue()
    })
  }

}
