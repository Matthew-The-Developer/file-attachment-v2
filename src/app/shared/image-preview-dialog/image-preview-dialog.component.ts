import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilePatient } from 'src/app/models/file-patient.model';

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.scss']
})
export class ImagePreviewDialogComponent implements OnInit {
  url!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilePatient) { }

  ngOnInit(): void {
    const reader = new FileReader();
    reader.onload = () => this.url = reader.result as string;
    reader.readAsDataURL(this.data.file!);
  }

  get alt(): string {
    return `${this.data.name} preview`;
  }
}
