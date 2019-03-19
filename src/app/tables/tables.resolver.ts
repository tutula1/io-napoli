import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TableService } from '../services/table.service';

@Injectable()
export class TablesResolver implements Resolve<any> {

  constructor(private tableService: TableService) {}

  resolve() {
    return this.tableService.getTables();
  }
}
