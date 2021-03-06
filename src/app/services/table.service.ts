import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import "firebase/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { UtilsService } from "./utils.service";

@Injectable({
  providedIn: "root",
})
export class TableService {
  private snapshotChangesSubscription: any;
  private name: any;
  private collection: any;

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public utilsService:  UtilsService) {
    this.name = "tables";
    this.collection = this.afs.collection(this.name);
  }

  getName() {
    return this.name;
  }

  getCollection() {
    return this.collection;
  }

  getTables() {
    return new Promise<any>((resolve, reject) => {
      try {
        this.snapshotChangesSubscription = this.collection.snapshotChanges();
        resolve(this.snapshotChangesSubscription);
      } catch (err) {
        reject(err);
      }
    });
  }

  getTable(tableId) {
    return new Promise<any>((resolve, reject) => {
      this.snapshotChangesSubscription = this.afs
        .doc(this.name + "/" + tableId)
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

  updateTable(tableKey, value) {
    return new Promise<any>((resolve, reject) => {
      this.collection
        .doc(tableKey)
        .set(value)
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  deleteTable(tableKey) {
    return new Promise<any>((resolve, reject) => {
      try{
        this.utilsService.deleteImage(this.name, tableKey);
      } catch(err){
        console.log(err);
      };
      this.collection
        .doc(tableKey)
        .delete()
        .then((res) => resolve(res), (err) => reject(err));
    });
  }

  createTable(value) {
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
