import { Component, OnInit, ViewChild } from '@angular/core';
import { FileRequestOptions } from '../models/file-request-options.model';
import { FileService } from '../services/file.service';
import { FileAttachmentComponent } from '../shared/file-attachment/file-attachment.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  byteSizeLimit = 2 * 1024 * 1024;
  minDocumentDate = new Date('2/1/2022');

  @ViewChild(FileAttachmentComponent) child!: FileAttachmentComponent;

  constructor(public fileService: FileService) { }

  ngOnInit(): void {
  }

  attachAll(): void {
    this.child.attachAll();
  }
}
