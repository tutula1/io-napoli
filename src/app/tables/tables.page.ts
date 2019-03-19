import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { TableService } from "../services/table.service";
import { UtilsService } from "../services/utils.service";

@Component({
  selector: "app-tables",
  templateUrl: "./tables.page.html",
  styleUrls: ["./tables.page.scss"],
})
export class TablesPage implements OnInit {
  items: Array<any>;
  full: Array<any>;
  search: any;
  showSearch: any;

  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private tableService: TableService,
    private utilsService: UtilsService,
  ) {
    this.search = "";
    this.showSearch = false;
  }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getData();
    }
  }

  async getData() {
    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    this.presentLoading(loading);

    this.route.data.subscribe((routeData) => {
      routeData["data"].subscribe((data) => {
        loading.dismiss();
        this.full = data;
        this.ionChangeSearch();
      });
    });
  }

  ionChangeSearch() {
    let items = [];
    if (this.search && this.search.length > 0) {
      items = this.full.filter((item) => {
        if (item.payload.doc.data().name.search(this.search) > -1) {
          return true;
        }
        return false;
      });
    } else {
      items = this.full;
    }
    items.sort(function(a, b) {
      return a.payload.doc.data().sequence - b.payload.doc.data().sequence;
    });
    this.items = items;
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async archive(item) {
    const alert = await this.alertCtrl.create({
      header: "Xác nhận",
      message:
        "Bạn muốn " +
        (item.payload.doc.data().active ? "tắt" : "bật") +
        " " +
        item.payload.doc.data().name +
        "?",
      buttons: [
        {
          text: "Huỷ",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: item.payload.doc.data().active ? "Tắt" : "Bật",
          handler: () => {
            let data = item.payload.doc.data();
            data.active = !data.active;
            this.tableService.updateTable(item.payload.doc.id, data).then(
              (res) => {
                this.utilsService.presentToast("Thành công!", 2000);
              },
              (err) => console.log(err),
            );
          },
        },
      ],
    });
    await alert.present();
  }

  async delete(item) {
    const alert = await this.alertCtrl.create({
      header: "Xác nhận",
      message: "Bạn muốn xoá " + item.payload.doc.data().name + "?",
      buttons: [
        {
          text: "Huỷ",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: "Xoá",
          handler: () => {
            this.tableService.deleteTable(item.payload.doc.id).then(
              (res) => {
                this.utilsService.presentToast("Thành công!", 2000);
              },
              (err) => console.log(err),
            );
          },
        },
      ],
    });
    await alert.present();
  }
}
