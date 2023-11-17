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
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

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

  protected isItemAvailable = false;

  protected autocompleteList = this.utilsService.listAdressesForAutocomplete$

  protected openStreetMap:L.TileLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })

  protected openTopoMap:L.TileLayer = tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })

  options = {
    layers: [
      this.openTopoMap
    ],
    zoom: 13,
    // center: latLng(43.6112422, 3.8767337)
    center: latLng(44.08130, 7.40599)
  };

  layersControl = {
    baseLayers: {
      'Open Street Map' : this.openStreetMap,
      'Open Topo Map' : this.openTopoMap
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

    /** Ion Search bar substituée par la barre de recherche geocoder (cf ci-dessous) */
    // let searchBar = L.Control.extend({

    //   onAdd: (map: Map) => {
    //     let container = L.DomUtil.create('ion-searchbar', 'leaflet-bar searchBar');
    //     container.placeholder = "Entrez un lieu"
    //     return container;
    //   },
    // })

    let geoCoderOptions = {
      collapsed: false,
      geocoder: (L.Control as any).Geocoder.nominatim({
            geocodingQueryParams: {
              countrycodes: 'fr'
            }
        })
    };
    
    (L.Control as any).geocoder(geoCoderOptions).addTo(map);

    this.map.addControl(new locateButton())

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
        this.summitService.summitModalToDisplay(ev.latlng).then((s) => this.openSummitModal(s))
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

  // getItems(event: any) {
  //   this.autocomplete(event.target.value != null ? event.target.value : '')
  //   event.target.value && event.target.value.trim() != '' ? this.isItemAvailable = true : this.isItemAvailable = false
  // }

  autocomplete(userQuery: string){
    this.utilsService.findByUserQueryWithPhotonAPI(userQuery).subscribe()
  }

}
