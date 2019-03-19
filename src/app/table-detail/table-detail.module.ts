import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule} from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TableDetailPage } from './table-detail.page';
import { TableDetailResolver } from './table-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: TableDetailPage,
    resolve: {
      data: TableDetailResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TableDetailPage],
  providers:[TableDetailResolver]
})
export class TableDetailPageModule {}
