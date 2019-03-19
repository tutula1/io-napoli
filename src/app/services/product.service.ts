import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { UtilsService } from "./utils.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private snapshotChangesSubscription: any;
  private name: any;
  private collection: any;

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public utilsService:  UtilsService) {
    this.name = "products";
    this.collection = this.afs.collection(this.name);
  }

  getName() {
    return this.name;
  }

  getCollection() {
    return this.collection;
  }

  getProducts() {
    return new Promise<any>((resolve, reject) => {
      try {
        this.snapshotChangesSubscription = this.collection.snapshotChanges();
        resolve(this.snapshotChangesSubscription);
      } catch (err) {
        reject(err);
      }
    });
  }

  getProduct(productId) {
    return new Promise<any>((resolve, reject) => {
      this.snapshotChangesSubscription = this.afs
        .doc(this.name + "/" + productId)
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

  updateProduct(productKey, value) {
    return new Promise<any>((resolve, reject) => {
      this.collection
        .doc(productKey)
        .set(value)
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  deleteProduct(productKey) {
    return new Promise<any>((resolve, reject) => {
      try{
        this.utilsService.deleteImage(this.name, productKey);
      } catch(err){
        console.log(err);
      };
      this.collection
        .doc(productKey)
        .delete()
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  createProduct(value) {
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
