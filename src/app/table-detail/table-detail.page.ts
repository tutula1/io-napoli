import { Component, OnInit } from '@angular/core';
import { TableService } from '../services/table.service';
import { UtilsService } from '../services/utils.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.page.html',
  styleUrls: ['./table-detail.page.scss'],
})
export class TableDetailPage implements OnInit {

  validations_form: FormGroup;
  image: any;
  item: any;
  load: boolean = false;

  constructor(
    private imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private tableService: TableService,
    private utilsService: UtilsService,
    private webview: WebView,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.route.data.subscribe(routeData => {
     let data = routeData['data'];
     if (data) {
       this.item = data;
       this.image = this.item.image;
     }
    })
    this.validations_form = this.formBuilder.group({
      name: new FormControl(this.item.name, Validators.required),
      active: new FormControl(this.item.active ? true : false),
      sequence: new FormControl(this.item.sequence, Validators.required),
      description: new FormControl(this.item.description)
    });
  }

  onSubmit(value){
    let data = {
      name: value.name,
      active: value.active ? true : false,
      description: value.description,
      sequence: value.sequence,
      image: this.image
    }
    this.tableService.updateTable(this.item.id,data)
    .then(
      res => {
        this.utilsService.presentToast("Thành công!")
      }
    )
  }

  async delete() {
    let image = "./assets/imgs/default_image.png";
    const alert = await this.alertCtrl.create({
      header: 'Xác nhận',
      message: 'Bạn muốn xoá ' + this.item.name + '?',
      buttons: [
        {
          text: 'Huỷ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Xoá',
          handler: () => {
            this.tableService.deleteTable(this.item.id)
            .then(
              res => {
                this.router.navigate(["/tables"]);
              },
              err => console.log(err)
            )
          }
        }
      ]
    });
    await alert.present();
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        this.imagePicker.getPictures({
          maximumImagesCount: 1
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
              this.uploadImageToFirebase(results[i]);
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImageToFirebase(image){
    this.utilsService.presentLoading();
    let image_src = this.webview.convertFileSrc(image);

    //uploads img to table storage
    this.tableService.uploadImage(image_src, this.item.id)
    .then(photoURL => {
      this.image = photoURL;
      this.utilsService.dismissLoading();
      this.utilsService.presentToast("Cập nhật hình ảnh thành công");
    }, err =>{
      console.log(err);
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
