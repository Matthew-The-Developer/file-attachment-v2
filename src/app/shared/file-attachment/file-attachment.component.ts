import { DataSource } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { FilePatient } from 'src/app/models/file-patient.model';
import { FileRequestOptions } from 'src/app/models/file-request-options.model';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss']
})
export class FileAttachmentComponent implements OnInit {
  @Input() options!: FileRequestOptions;
  @Input() groupIDs!: number[];
  @Input() documentDateLabel: string = 'Document Date';
  
  displayedColumns: string[] = ['name', 'status', 'size', 'date', 'group', 'type', 'actions'];
  
  _existingFiles: BehaviorSubject<FilePatient[] | null> = new BehaviorSubject<FilePatient[] | null>(null);
  dataSource: FileDataSource = new FileDataSource([]);

  dateChanging: Map<FilePatient, boolean> = new Map<FilePatient, boolean>();

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.fileService.getPatientFiles(this.options).subscribe(this._existingFiles);

    this._existingFiles.pipe(val => val!!).subscribe(files => this.dataSource.setData(files!!));
  }

  get fileCount(): string { return this._existingFiles.value ? `${this._existingFiles.value?.length}` : `...` }

  fileDateChange(file: FilePatient, date: Date): void {
    if (file.attachedToRecordID !== undefined) {
      this.dateChanging.set(file, true);
      this.fileService.updatePatientFileDate(file, date, this.options).subscribe(files => {
        this._existingFiles.next(files);
        this.dateChanging.delete(file);
      });
    } else {
      file.documentDate = date;
    }
  }
}

class FileDataSource extends DataSource<FilePatient> {
  private _dataStream = new ReplaySubject<FilePatient[]>();

  constructor(initialData: FilePatient[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<readonly FilePatient[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: FilePatient[]) {
    this._dataStream.next(data);
  }
}
