import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  private _storage : Storage | null = null

  constructor(private storage: Storage) {
    this.init()
  }

  private loginUrl: string = `${environment.restWebServiceUrl}session`;

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key:string, value:string){
    this.storage.set(key, value);
  }

}
