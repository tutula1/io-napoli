import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { TableService } from "./table.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private name: any;
  private collection: any;

  constructor(
    public afs: AngularFirestore,
    private tableService: TableService,
    public afAuth: AngularFireAuth,
  ) {
    this.name = "users";
    this.collection = this.afs.collection(this.name);
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (user) => {
            firebase
              .auth()
              .currentUser.updateProfile({
                displayName: value.name,
                photoURL: '../assets/imgs/default_image.png'
              })
              .then(
                (res) => {
                  this.collection
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                      email: value.email,
                      name: value.name,
                      photoURL: '../assets/imgs/default_image.png',
                      role: value.email == "admin@napoli.coffee" ? 1 : 10,
                      active:
                        value.email == "admin@napoli.coffee" ? true : false,
                      timestamp: new Date(),
                    })
                    .then((res) => resolve(user), (err) => reject(err));
                },
                (err) => {
                  reject(err);
                },
              );
          },
          (err) => reject(err),
        );
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (user) => {
            this.collection
              .doc(firebase.auth().currentUser.uid)
              .get()
              .subscribe(
                (user) => {
                  if (user.data().active) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                },
                (err) => {
                  resolve(false);
                },
              );
          },
          (err) => reject(err),
        );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth
          .signOut()
          .then(() => {
            this.tableService.unsubscribeOnLogOut();
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject();
          });
      } else {
        resolve();
      }
    });
  }
}
