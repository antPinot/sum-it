import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummitDetailPage } from './summit-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SummitDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummitDetailPageRoutingModule {}
