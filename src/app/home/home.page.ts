import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';
import { Icon, Map, Marker, icon, latLng, marker, tileLayer } from 'leaflet';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { SummitService } from '../services/summit/summit.service';
import { ModalController } from '@ionic/angular';
import { SummitModalComponent } from '../summit-modal/summit-modal.component';
import { Summit } from '../models/ISummit';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected title!: string

  protected map!: Map;

  protected summitMarkers: Marker[] = []

  protected summitToDisplay!: Summit

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 13,
    center: latLng(43.6112422, 3.8767337)
  };

  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      'Open Topo Map': tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    },
    overlays: {
    }
  }

  pin = marker([0, 0], {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: '../../assets/icon/marker-icon.png',
      iconRetinaUrl: '../../assets/icon/marker-icon-2x.png',
      shadowUrl: '../../assets/icon/marker-shadow.png'
    })
  })

  constructor(private utilsService: UtilsService, private router: Router, private summitService: SummitService, private modalCtrl:ModalController) { }

  ngOnInit(): void {
    this.title = this.utilsService.getTitleFromUrl(this.router.url)
  }

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => this.map.invalidateSize(true), 500)
    let locateButton = L.Control.extend({
      options: {
        position: 'topleft'
      },

      onAdd: (map: Map) => {
        let container = L.DomUtil.create('img', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.src = "../../assets/icon/locate.png"

        container.onclick = () => Geolocation.getCurrentPosition({enableHighAccuracy: true}).then((position) => {
          this.pin.setLatLng([position.coords.latitude, position.coords.longitude]).addTo(this.map)
        });
        return container;
      }
    })

    let searchBar = L.Control.extend({

      onAdd: (map: Map) => {
        let container = L.DomUtil.create('ion-searchbar', 'leaflet-bar searchBar');
        container.placeholder = "Entrez un lieu"
        return container;
      }
    })

    this.map.addControl(new locateButton()).addControl(new searchBar())

    this.summitService.getCoordinates().forEach((coordinate) => {
      let summitMarker: Marker
      summitMarker = marker([coordinate.lat, coordinate.lng], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: '../../assets/icon/marker-icon.png',
          iconRetinaUrl: '../../assets/icon/marker-icon-2x.png',
          shadowUrl: '../../assets/icon/marker-shadow.png'
        }),
      })
      summitMarker.addTo(this.map)
      summitMarker.addEventListener('click', (ev) => {
        this.summitService.summitModal(ev.latlng).then((s) => this.openSummitModal(s))
      })
      this.summitMarkers.push(summitMarker)
    })

  }

  async openSummitModal(summitParam: Summit){
    const modal = await this.modalCtrl.create({
      component: SummitModalComponent,
      componentProps: {
        summit : summitParam
      },
      cssClass: 'summitModal'
    });
    modal.present()
  }

}
