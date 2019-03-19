import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'orders', loadChildren: './orders/orders.module#OrdersPageModule' },
  // { path: 'orders/:id', loadChildren: './orders-detail/orders-detail.module#OrdersDetailPageModule' },
  // { path: 'new-orders', loadChildren: './new-orders/new-orders.module#NewOrdersPageModule' },
  { path: 'tables', loadChildren: './tables/tables.module#TablesPageModule' },
  { path: 'table/:id', loadChildren: './table-detail/table-detail.module#TableDetailPageModule' },
  { path: 'new-table', loadChildren: './new-table/new-table.module#NewTablePageModule' },
  // { path: 'products', loadChildren: './products/products.module#ProductsPageModule' },
  // { path: 'product/:id', loadChildren: './product-detail/product-detail.module#ProductDetailPageModule' },
  // { path: 'new-product', loadChildren: './new-product/new-product.module#NewProductPageModule' },
  { path: 'product-categories', loadChildren: './product-categories/product-categories.module#ProductCategoriesPageModule' },
  // { path: 'product-category/:id', loadChildren: './product-category-detail/product-category-detail.module#ProductCategoryDetailPageModule' },
  // { path: 'new-product-category', loadChildren: './new-product-category/new-product-category.module#NewProductCategoryPageModule' },
  // { path: 'users', loadChildren: './users/users.module#UsersPageModule' },
  // { path: 'user/:id', loadChildren: './user-detail/user-detail.module#UserDetailPageModule' },
  // { path: 'new-user', loadChildren: './new-user/new-user.module#NewUserPageModule' },
  // { path: 'new-task-modal', loadChildren: './new-task-modal/new-task-modal.module#NewTaskModalPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
