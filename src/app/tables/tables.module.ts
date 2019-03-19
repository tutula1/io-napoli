import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TablesPage } from "./tables.page";
import { TablesResolver } from "./tables.resolver";

const routes: Routes = [
  {
    path: "",
    component: TablesPage,
    resolve: {
      data: TablesResolver,
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
  declarations: [TablesPage],
  providers: [TablesResolver],
})
export class TablesPageModule {}
