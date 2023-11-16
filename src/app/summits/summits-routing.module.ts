import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummitsPage } from './summits.page';

const routes: Routes = [
  {
    path: '',
    component: SummitsPage
  },
  {
    path: 'summit-detail/:id',
    loadChildren: () => import('../summit-detail/summit-detail.module').then( m => m.SummitDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummitsPageRoutingModule {}
