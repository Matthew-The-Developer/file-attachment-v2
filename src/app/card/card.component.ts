import { Component, OnInit } from '@angular/core';
import { FileRequestOptions } from '../models/file-request-options.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  options: FileRequestOptions = { attachmentWorkItemID: 29 };
  groupIDs = [ 0 ];

  constructor() { }

  ngOnInit(): void {
  }

}
