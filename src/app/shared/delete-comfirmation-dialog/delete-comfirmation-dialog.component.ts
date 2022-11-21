import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-comfirmation-dialog',
  templateUrl: './delete-comfirmation-dialog.component.html',
  styleUrls: ['./delete-comfirmation-dialog.component.scss']
})
export class DeleteComfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

}
