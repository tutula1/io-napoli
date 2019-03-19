import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdersPage } from './orders.page';
import { OrdersResolver } from './orders.resolver';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage,
    resolve: {
      data: OrdersResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrdersPage],
  providers: [
    OrdersResolver
  ]
})
export class OrdersPageModule {}
