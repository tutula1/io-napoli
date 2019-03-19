import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ProductCategoryService } from '../services/product-category.service';

@Injectable()
export class ProductCategoriesResolver implements Resolve<any> {

  constructor(private productCategoryService: ProductCategoryService) {}

  resolve() {
    return this.productCategoryService.getProductCategories();
  }
}
