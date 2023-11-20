import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { register } from 'swiper/element';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
  imports:[CommonModule],
  standalone: true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class GalleryModalComponent  implements OnInit {

  protected photoGallery!: string[]

  constructor() { }

  ngOnInit() {
    register();
  }

}
