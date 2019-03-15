import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import * as firebase from "firebase/app";

import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  private name: any;
  private collection: any;
  constructor(
    public afs: AngularFirestore,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public afAuth: AngularFireAuth,
  ) {
    this.name = "users";
    this.collection = this.afs.collection(this.name);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.afAuth.user.subscribe(
        (user) => {
          if (user && user.providerData.length > 0) {
            this.collection
              .doc(user.providerData[0].email)
              .get()
              .subscribe(
                (user) => {
                  if (user.data().active) {
                    this.router.navigate(["/home"]);
                  } else {
                    this.afAuth.auth
                      .signOut()
                      .then(() => {
                        this.router.navigate(["/login"]);
                      })
                      .catch((error) => {
                        this.router.navigate(["/login"]);
                      });
                  }
                },
                (err) => {
                  this.router.navigate(["/login"]);
                },
              );
          } else {
            this.router.navigate(["/login"]);
          }
        },
        (err) => {
          this.router.navigate(["/login"]);
        },
        () => {
          this.splashScreen.hide();
        },
      );
      this.statusBar.styleDefault();
    });
  }
}
