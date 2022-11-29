import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { FileAttachmentComponent } from './file-attachment/file-attachment.component';
import { SpacerDirective } from './directives/spacer.directive';
import { CompactDirective } from './directives/compact.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSizePipe } from './pipes/file-size.pipe';
import { DeleteComfirmationDialogComponent } from './delete-comfirmation-dialog/delete-comfirmation-dialog.component';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { PdfPreviewDialogComponent } from './pdf-preview-dialog/pdf-preview-dialog.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    FileAttachmentComponent,
    SpacerDirective,
    CompactDirective,
    FileSizePipe,
    DeleteComfirmationDialogComponent,
    ImagePreviewDialogComponent,
    PdfPreviewDialogComponent
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FileAttachmentComponent,
    SpacerDirective
  ]
})
export class SharedModule { }
