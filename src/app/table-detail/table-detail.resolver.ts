import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { TableService } from '../services/table.service';

@Injectable()
export class TableDetailResolver implements Resolve<any> {

  constructor(public tableService: TableService,) { }

  resolve(route: ActivatedRouteSnapshot) {

    return new Promise((resolve, reject) => {
      let itemId = route.paramMap.get('id');
      this.tableService.getTable(itemId)
      .then(data => {
        data.id = itemId;
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }
}
