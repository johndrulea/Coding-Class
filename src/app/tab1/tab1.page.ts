import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Message } from '../models/message';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
 
  displayMessage: Message[];

  constructor(private data: DataService, private shared: SharedService) {
    data.getAllMessages().subscribe(list => {

      var filtered = [];
      for(let i =0; i<list.length; i++){
        var m = list[i];
        if(m.to =="General" || m.to == shared.userName || m.from == shared.userName ){
          filtered.push(m);
        }
      }
      
      this.displayMessage = filtered.sort((left, right) => {
          if(!left.createdOn) return -1; // if left don't have a date, it goes first

          if(left.createdOn > right.createdOn){
            return 1;
          }
          else if(right.createdOn > left.createdOn){
            return -1;
          }
          return 0;
      })
    });
  }
}
