import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { Router } from '@angular/router';
import { Icon, Map, icon, latLng, marker, tileLayer } from 'leaflet';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected title!: string

  protected map!: Map;

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

  constructor(private utilsService: UtilsService, private router: Router) { }

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
        var container = L.DomUtil.create('img', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.src = "../../assets/icon/locate.png"

        container.onclick = () => Geolocation.getCurrentPosition().then((position) => {
          console.log('coucou')
          this.pin.setLatLng([position.coords.latitude, position.coords.longitude]).addTo(this.map)
        });
        return container;
      }
    })

    this.map.addControl(new locateButton())
  }

}
