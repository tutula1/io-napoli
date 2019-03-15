import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirebaseService } from "./firebase.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private name: any;
  private collection: any;

  constructor(
    public afs: AngularFirestore,
    private firebaseService: FirebaseService,
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
              })
              .then(
                (res) => {
                  this.collection
                    .doc(value.email)
                    .set({
                      email: value.email,
                      name: value.name,
                      role: 10,
                      active: false,
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
            if (
              firebase.auth().currentUser &&
              firebase.auth().currentUser.providerData.length > 0
            ) {
              this.collection
                .doc(firebase.auth().currentUser.providerData[0].email)
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
            } else {
              resolve(false);
            }
          },
          (err) => reject(err),
        );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .signOut()
        .then(() => {
          this.firebaseService.unsubscribeOnLogOut();
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }
}
