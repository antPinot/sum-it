import { Component, Input, OnInit } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ToastController } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { FavoriteToAdd } from 'src/app/models/IFavoriteToAdd';
import { Summit } from 'src/app/models/ISummit';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { SummitService } from 'src/app/services/summit/summit.service';

@Component({
  selector: 'app-favorite-icon',
  templateUrl: './favorite-icon.component.html',
  styleUrls: ['./favorite-icon.component.scss'],
})
export class FavoriteIconComponent  implements OnInit {

  @Input()
  public summit!:Summit

  protected isAuthenticated$ = new Observable<boolean>();

  constructor(private toastCtrl:ToastController, private summitService:SummitService, private authService:AuthenticationService) {}

  ngOnInit() {
    this.isAuthenticated$ = this.authService.userInfo$.pipe(
          map((userInfo) => !!userInfo.username)
        )
  }
    /**
     * Ajoute/Retire un sommet aux favoris, émet une vibration (plugin Capacitor Haptics) et affiche un toast en fond de page si un sommet est ajouté/retiré des favoris
     * @param summit
     * @param event
     */
    async manageFavorites(summit: Summit, event: Event) {
      //Stopper la propagation pour éviter que le clic envoie sur le détail du sommet (liste des sommets)
      event.stopPropagation();
      await Haptics.impact({ style: ImpactStyle.Medium });
      const toast = await this.toastCtrl.create({
        message: this.summitService.checkIfFavorite(summit.id) ? 'Ce sommet a été retiré de vos favoris' : 'Ce sommet a été ajouté à vos favoris',
        duration: 2000,
        position: 'bottom'
      })
      await toast.present();

      const favoriteToAdd : FavoriteToAdd = {username: this.authService.userInfo$.getValue().username, favoriteSummitId : summit.id}
      this.summitService.manageFavorites(favoriteToAdd)?.subscribe()
    }

    /**
     * Récupère les icônes favoris des sommets et modifie l'icône en fonction
     * @param summit
     * @returns
     */
    favoriteIcon(summit: Summit): string {
      return this.summitService.favoriteIcon(summit);
    }

}
