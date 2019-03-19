import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { UtilsService } from "./utils.service";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  private snapshotChangesSubscription: any;
  private name: any;
  private collection: any;

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public utilsService:  UtilsService) {
    this.name = "orders";
    this.collection = this.afs.collection(this.name);
  }

  getName() {
    return this.name;
  }

  getCollection() {
    return this.collection;
  }

  getOrderss() {
    return new Promise<any>((resolve, reject) => {
      try {
        this.snapshotChangesSubscription = this.collection.snapshotChanges();
        resolve(this.snapshotChangesSubscription);
      } catch (err) {
        reject(err);
      }
    });
  }

  getOrders(ordersId) {
    return new Promise<any>((resolve, reject) => {
      this.snapshotChangesSubscription = this.afs
        .doc(this.name + "/" + ordersId)
        .valueChanges()
        .subscribe(
          (snapshots) => {
            resolve(snapshots);
          },
          (err) => {
            reject(err);
          },
        );
    });
  }

  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    if (this.snapshotChangesSubscription) {
      this.snapshotChangesSubscription.unsubscribe();
    }
  }

  updateOrders(ordersKey, value) {
    return new Promise<any>((resolve, reject) => {
      this.collection
        .doc(ordersKey)
        .set(value)
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  deleteOrders(ordersKey) {
    return new Promise<any>((resolve, reject) => {
      try{
        this.utilsService.deleteImage(this.name, ordersKey);
      } catch(err){
        console.log(err);
      };
      this.collection
        .doc(ordersKey)
        .delete()
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  createOrders(value) {
    value.timestamp = new Date();
    return new Promise<any>((resolve, reject) => {
      this.collection
        .add(value)
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  uploadImage(imageURI, id){
    return this.utilsService.uploadImage(imageURI, this.name, id);
  }
}
