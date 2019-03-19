import { Component } from "@angular/core";

import { Platform, NavController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import * as firebase from "firebase/app";

import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { UtilsService } from "./services/utils.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  private name: any;
  private collection: any;
  public user: any;
  public appPages: any;
  constructor(
    public afs: AngularFirestore,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private utilsService: UtilsService,
    private navCtrl: NavController,
  ) {
    this.name = "users";
    this.collection = this.afs.collection(this.name);
    this.user = false;
    this.appPages = [];
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      firebase.auth().onAuthStateChanged(
        (user) => {
          if (user) {
            this.init();
          } else {
            this.navCtrl.navigateRoot("/login");
          }
        },
        (err) => {
          this.navCtrl.navigateRoot("/login");
        },
        () => {
          this.splashScreen.hide();
        },
      );
      // this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      // this.statusBar.styleDefault();
    });
  }

  init() {
    if (firebase.auth().currentUser) {
      this.collection
        .doc(firebase.auth().currentUser.uid)
        .get()
        .subscribe(
          (user) => {
            if (user.data().active) {
              this.user = user.data();
              this.utilsService.presentToast(
                "Chào " + this.user.name + " đã quay trở lại!",
                1000,
              );
              let appPages = [
                {
                  title: "Hoá đơn",
                  url: "/orders",
                  icon: "calendar",
                },
              ];
              if (this.user.role <= 5) {
                appPages.push({
                  title: "Danh mục đồ uống",
                  url: "/product-categories",
                  icon: "list",
                });
                appPages.push({
                  title: "Đồ uống",
                  url: "/products",
                  icon: "cafe",
                });
              }
              if (this.user.role <= 1) {
                appPages.push({
                  title: "Bàn",
                  url: "/tables",
                  icon: "cube",
                });
                appPages.push({
                  title: "Người dùng",
                  url: "/users",
                  icon: "contacts",
                });
              }
              appPages.push({
                title: "Đăng xuất",
                url: "/login",
                icon: "log-out",
              });
              this.appPages = appPages;
            } else {
              this.logout();
            }
          },
          (err) => {
            this.navCtrl.navigateRoot("/login");
          },
        );
    }
  }

  logout() {
    this.authService.doLogout().then(
      (res) => {
        this.user = false;
        // this.navCtrl.navigateRoot("/login");
      },
      (err) => {
        console.log(err);
      },
    );
  }
}
