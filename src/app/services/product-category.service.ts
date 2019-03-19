import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { UtilsService } from "./utils.service";

@Injectable({
  providedIn: "root",
})
export class ProductCategoryService {
  private snapshotChangesSubscription: any;
  private name: any;
  private collection: any;

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public utilsService:  UtilsService) {
    this.name = "product-categories";
    this.collection = this.afs.collection(this.name);
  }

  getName() {
    return this.name;
  }

  getCollection() {
    return this.collection;
  }

  getProductCategories() {
    return new Promise<any>((resolve, reject) => {
      try {
        this.snapshotChangesSubscription = this.collection.snapshotChanges();
        resolve(this.snapshotChangesSubscription);
      } catch (err) {
        reject(err);
      }
    });
  }

  getProductCategory(productCategoryId) {
    return new Promise<any>((resolve, reject) => {
      this.snapshotChangesSubscription = this.afs
        .doc(this.name + "/" + productCategoryId)
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

  updateProductCategory(productCategoryKey, value) {
    return new Promise<any>((resolve, reject) => {
      this.collection
        .doc(productCategoryKey)
        .set(value)
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  deleteProductCategory(productCategoryKey) {
    return new Promise<any>((resolve, reject) => {
      try{
        this.utilsService.deleteImage(this.name, productCategoryKey);
      } catch(err){
        console.log(err);
      };
      this.collection
        .doc(productCategoryKey)
        .delete()
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  createProductCategory(value) {
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
