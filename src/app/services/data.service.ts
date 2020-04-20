import { Message } from './../models/message';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { map } from  'rxjs/operators';
import { firestore } from 'firebase';
import { Friend } from '../models/Friends';


@Injectable({
  providedIn: 'root'
})

export class DataService {

allMessage: Observable<Message[]>;
messageCollection: AngularFirestoreCollection<Message>; //pipeline to firebase database

allFriends: Observable<Friend[]>;
friendCollection: AngularFirestoreCollection<Friend>;




  constructor(private fb: AngularFirestore) {
    this.messageCollection = fb.collection<Message>('posts');
    this.friendCollection = fb.collection<Friend>('friends');//initialize the connection app -> firebase
  }

  //retrieveMessagesFromDB(){
  //  this.allMessage =this.messageCollection.valueChanges();
  //}

  retrieveMessagesFromDB(){
    this.allMessage = this.messageCollection.snapshotChanges().pipe(
      map(actions => {
          return actions.map(a => {
              let data = a.payload.doc.data();
              var d: any = data.createdOn; // <- firebase data format
              if(d){
                data.createdOn = new firestore.Timestamp(d.seconds, d.nanoseconds).toDate();
              }
              return {... data }
          })
      })
    );
  }

  retrieveFriendsFromDB(){
    this.allFriends = this.friendCollection.valueChanges();
  }

  public saveMessage(message){
    var plain = Object.assign({}, message);
    this.messageCollection.add(plain);
  };

  public getAllMessages(){
    this.retrieveMessagesFromDB(); //subscribe to changes
    return this.allMessage;
  };

  public saveFriend(friend){
    var plain = Object.assign({}, friend);
    this.friendCollection.add(plain);
  };

  public getAllFriends(){
    this.retrieveFriendsFromDB(); //subscribe to changes
    return this.allFriends;
  };

}
