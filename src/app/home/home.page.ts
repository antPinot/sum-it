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
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

/**
 * Composant de la page d'accueil qui contient notamment
 * les fonctionnalités de géolocalisation et de recherche de lieu
 *
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  /**Titre de la page */
  protected title!: string;

  /**Carte leaflet */
  protected map!: Map;

  /**Marqueurs de sommets */
  protected summitMarkers: Marker[] = [];

  /** */
  // protected summitToDisplay!: Summit

  /**Couche Open Street Map */
  protected openStreetMap: L.TileLayer = tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 18, attribution: '...' }
  );

  /**Couche Open Topo Map */
  protected openTopoMap: L.TileLayer = tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    { maxZoom: 18, attribution: '...' }
  );

  /** Options par défaut de la carte leaflet*/
  options = {
    layers: [this.openTopoMap],
    zoom: 13,
    center: latLng(44.0813, 7.40599),
  };

  /**Fond de cartes sélectionnables */
  layersControl = {
    baseLayers: {
      'Open Street Map': this.openStreetMap,
      'Open Topo Map': this.openTopoMap,
    },
    overlays: {},
  };

  /** Marqueur pour la géolocalisation*/
  pin = marker([0, 0], {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: '../../assets/icon/marker-icon.png',
      iconRetinaUrl: '../../assets/icon/marker-icon-2x.png',
      shadowUrl: '../../assets/icon/marker-shadow.png',
    }),
  });

  constructor(
    private utilsService: UtilsService,
    private router: Router,
    private summitService: SummitService,
    private modalCtrl: ModalController
  ) {}

  /**
   * Initialisation avec récupération du titre de la page
   */
  ngOnInit(): void {
    this.title = this.utilsService.getTitleFromUrl(this.router.url);
  }

  /**
   *
   *
   * @param map carte leafltet
   */
  onMapReady(map: Map) {
    this.map = map;
    //Permet le chargement correct de la carte (attend le chargement des composants Ionic)
    setTimeout(() => this.map.invalidateSize(true), 500);

    //Ajout boutton de géolocalisation
    let locateButton = L.Control.extend({
      options: {
        position: 'topleft',
      },

      onAdd: () => {
        let container = L.DomUtil.create(
          'img',
          'leaflet-bar leaflet-control leaflet-control-custom'
        );
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.src = '../../assets/icon/locate.png';

        //Appel au plugin Capacitor Geolocation puis ajoute le marqueur de géolocalisation et centre la carte sur celui-ci
        container.onclick = () =>
          Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(
            (position) => {
              this.pin
                .setLatLng([
                  position.coords.latitude,
                  position.coords.longitude,
                ])
                .addTo(this.map);
              this.map.panTo([
                position.coords.latitude,
                position.coords.longitude,
              ]);
            }
          );
        return container;
      },
    });

    this.map.addControl(new locateButton());

    // Ajout geocoder pour recherche de lieu (via API Nominatim)
    // let geoCoderOptions = {
    //   collapsed: false,
    //   geocoder: (L.Control as any).Geocoder.nominatim({
    //     geocodingQueryParams: {
    //       countrycodes: 'fr',
    //     },
    //   }),
    // };

    // (L.Control as any).geocoder(geoCoderOptions).addTo(map);

    /** Ion Search bar substituée par la barre de recherche geocoder (cf ci-dessous) */
    // let SearchBar = L.Control.extend({
    //   onAdd: () => {
    //     let container = L.DomUtil.create(
    //       'ion-searchbar',
    //       'leaflet-bar searchBar'
    //     );
    //     container.placeholder = 'Entrez un lieu';
    //     return container;
    //   },
    // });

    // this.map.addControl(new SearchBar());

    //Ajoute un marqueur pour tous les sommets de l'application et
    //ajoute un listener sur chaque marqueur pour ouvrir un ion-modal
    this.summitService.getCoordinates().forEach((coordinate) => {
      let summitMarker: Marker;
      summitMarker = marker([coordinate.lat, coordinate.lng], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: '../../assets/icon/marker-icon.png',
          iconRetinaUrl: '../../assets/icon/marker-icon-2x.png',
          shadowUrl: '../../assets/icon/marker-shadow.png',
        }),
      });
      summitMarker.addTo(this.map);
      summitMarker.addEventListener('click', (ev) => {
        this.summitService
          .summitModalToDisplay(ev.latlng)
          .then((s) => this.openSummitModal(s));
      });
      this.summitMarkers.push(summitMarker);
    });

  }

  /**
   * Controller d'un ion-modal
   *
   * @param summitParam summit à envoyer au component de l'ion-modal
   */
  async openSummitModal(summitParam: Summit) {
    const modal = await this.modalCtrl.create({
      component: SummitModalComponent,
      componentProps: {
        summit: summitParam,
      },
      breakpoints: [0, 0.62],
      initialBreakpoint: 0.62,
      cssClass: 'summitModal',
    });
    modal.present();
  }

  /** Pour l'autocomplémtion (Non implémenté)*/
  protected isItemAvailable = false;

  /**Liste des adresses proposées pour l'autocomplétion (Non implémenté) */
  protected autocompleteList = this.utilsService.listAdressesForAutocomplete$;

  getItems(event: any) {
    this.autocomplete(event.target.value != null ? event.target.value : '');
    event.target.value && event.target.value.trim() != ''
      ? (this.isItemAvailable = true)
      : (this.isItemAvailable = false);
  }

  /**
   * Méthode pour l'autocomplétion (non implémenté)
   * @param userQuery
   */
  autocomplete(userQuery: string) {
    this.utilsService.findByUserQueryWithPhotonAPI(userQuery).subscribe();
  }
}
