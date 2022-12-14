import { Component } from '@angular/core';
import { FileMode } from './models/file-mode.enum';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'file-attachment-v2';

  constructor(public fileService: FileService) { }

  fileModeName(mode: FileMode): string {
    switch(mode) {
      case FileMode.uploadonly: return 'Upload Only';
      case FileMode.readonly: return 'Read Only';
      case FileMode.readAndUpload: return 'Read & Upload';
      default: return '';
    }
  }

  workItemName(id: number): string {
    switch(id) {
      case 24: return 'One Group';
      case 23: return 'Multiple Groups';
      case 22: return 'All Groups';
      default: return '';
    }
  }
}
