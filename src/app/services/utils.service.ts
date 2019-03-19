import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private snapshotChangesSubscription: any;
  private loading: any;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ){
    this.init();
  }

  async init(){
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
  }

  async presentToast(message='', duration=3000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }
  
  async presentLoading() {
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, name, id){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child(name).child(id);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }

  deleteImage(name, id){
    return new Promise<any>((resolve, reject) => {
        try {
            let storageRef = firebase.storage().ref();
            storageRef.child(name).child(id).delete();
            resolve();
        } catch(err) {
            reject(err);
        }
    })
  }

}