import { Component, OnInit } from '@angular/core';
import { TableService } from '../services/table.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {  NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.page.html',
  styleUrls: ['./new-table.page.scss'],
})
export class NewTablePage implements OnInit {

  validations_form: FormGroup;
  image: any;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private tableService: TableService,
    public utilsService: UtilsService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.resetFields();
  }

  resetFields(){
    this.image = "./assets/imgs/default_image.png";
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      sequence: new FormControl(1, Validators.required),
      description: new FormControl('')
    });
  }

  onSubmit(value){
    this.utilsService.presentLoading();
    let data = {
      name: value.name,
      active: true,
      sequence: value.sequence,
      description: value.description,
      image: this.image
    }
    this.tableService.createTable(data)
    .then(
      res => {
        this.utilsService.dismissLoading();
        this.utilsService.presentToast('Thành công!', 2000);
        this.navCtrl.navigateRoot("/tables");
      },
      err => {
        this.utilsService.dismissLoading();
        this.utilsService.presentToast(err.message);
      }
    )
  }

}
