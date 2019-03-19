import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ProductCategoriesPage } from "./product-categories.page";
import { ProductCategoriesResolver } from "./product-categories.resolver";

const routes: Routes = [
  {
    path: "",
    component: ProductCategoriesPage,
    resolve: {
      data: ProductCategoriesResolver,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProductCategoriesPage],
  providers: [ProductCategoriesResolver],
})
export class ProductCategoriesPageModule {}
