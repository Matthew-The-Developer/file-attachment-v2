import { DataSource } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { setupTestingRouter } from '@angular/router/testing';
import { BehaviorSubject, filter, forkJoin, map, Observable, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { CallStatus } from 'src/app/models/call-status.enum';
import { FileAction } from 'src/app/models/file-action.enum';
import { FileExtension } from 'src/app/models/file-extension.model';
import { FileGroupType, FileTypeGroup } from 'src/app/models/file-group-type.model';
import { FileMode } from 'src/app/models/file-mode.enum';
import { FilePatient } from 'src/app/models/file-patient.model';
import { FileRequestOptions } from 'src/app/models/file-request-options.model';
import { FileState } from 'src/app/models/file-state.model';
import { FileService } from 'src/app/services/file.service';
import { DeleteComfirmationDialogComponent } from '../delete-comfirmation-dialog/delete-comfirmation-dialog.component';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';

@Component({
  selector: 'app-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.scss']
})
export class FileAttachmentComponent implements OnInit, OnChanges {
  @Input() options!: FileRequestOptions;
  @Input() workItemID!: number;
  @Input() mode: FileMode = FileMode.uploadonly;
  @Input() byteSizeLimit?: number = undefined;
  @Input() singleFile: boolean = false;
  @Input() defaultToDateUploaded: boolean = false;
  @Input() defaultAttachmentTypeID?: number = undefined;
  @Input() documentDateLabel: string = 'Document Date';
  
  displayedColumns: string[] = ['name', 'size', 'date', 'type', 'actions'];
  
  _attachmentTypeGroups: BehaviorSubject<FileTypeGroup[] | null> = new BehaviorSubject<FileTypeGroup[] | null>(null);
  _filteredTypeGroups: BehaviorSubject<FileTypeGroup[] | null> = new BehaviorSubject<FileTypeGroup[] | null>(null)
  _extensions: BehaviorSubject<FileExtension[] | null> = new BehaviorSubject<FileExtension[] | null>(null);
  
  _selectedFiles: BehaviorSubject<FilePatient[]> = new BehaviorSubject<FilePatient[]>([]);
  _existingFiles: BehaviorSubject<FilePatient[] | null> = new BehaviorSubject<FilePatient[] | null>(null);
  dataSource: FileDataSource = new FileDataSource([]);

  filterControl: FormControl = new FormControl();

  fileState: Map<FilePatient, FileState> = new Map<FilePatient, FileState>();

  constructor(
    private fileService: FileService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(): void {
    this.initialize();
  }

  get existingFiles$(): Observable<FilePatient[] | null> { return this._existingFiles.asObservable() }
  get attachmentTypeGroups$(): Observable<FileTypeGroup[] | null> { return this._attachmentTypeGroups.asObservable() }
  get filteredTypeGroups$(): Observable<FileTypeGroup[] | null> { return this._filteredTypeGroups.asObservable() }
  get attachmentTypes$(): Observable<FileGroupType[]> { return this._attachmentTypeGroups.pipe(val => val!!, map(groups => groups![0].types)) }
  get extensions$(): Observable<FileExtension[] | null> { return this._extensions.asObservable() }
  get acceptableExtensions$(): Observable<string> { 
    return this._extensions.asObservable().pipe(
      filter(types => !!types),
      map(types => types!.map(type => `.${type.extension}`).join(','))
    );
  }
  get showStatus(): boolean { return this.mode === FileMode.readAndUpload }
  get multipleAttachmentTypeGroups(): boolean { return this._attachmentTypeGroups.value!.length > 1 }

  public attachAll(): void {
    const files = this._selectedFiles.value;

    files.forEach(file => {
      if (!this.hasInvalidSize(file) && !this.hasInvalidExtension(file)) {
        this.attach(file);
      }
    });
  }

  select(event: any): void {
    if (event.target.files.length > 0) {
      const files: FilePatient[] = (Array.from(event.target.files) as File[]).map((file: File) => {
        const splitName = file.name.split('.');
        const name = splitName.slice(0, -1).join('.');
        const extensionRef = this._extensions.value!.find(extension => extension.extension === splitName[splitName.length - 1]);

        let fileType = null;
        if (this.defaultAttachmentTypeID) {
          this._attachmentTypeGroups.value!.forEach(group => {
            if (group.types.some(type => type.groupTypeID === this.defaultAttachmentTypeID)) {
              fileType = group.types.find(type => type.groupTypeID === this.defaultAttachmentTypeID)
            }
          });
        } else {
          fileType = this._attachmentTypeGroups.value![0].types[0];
        }

        return {
          file,
          name,
          byteSize: file.size,
          extensionID: extensionRef!.extensionID,
          extension: extensionRef!.extension,
          documentDate: this.defaultToDateUploaded ? new Date() : new Date(file.lastModified),
          groupTypeID: fileType!.groupTypeID,
          typeName: fileType!.typeName,
          groupName: fileType!.groupName,
        };
      });

      this._selectedFiles.next(files);
      event.target.value = null;
    }
  }

  deselect(fileToRemove: FilePatient): void {
    const files = this._selectedFiles.value;
    this._selectedFiles.next(files.filter(file => file !== fileToRemove));
  }

  attach(file: FilePatient): void {
    this.loading(file, FileAction.Attach);

    this.fileService.createPatientFile(file, this.options).subscribe(files => {
      if (this.mode !== FileMode.uploadonly) {
        this._existingFiles.next(files);
      }
      this.success(file, FileAction.Attach);
      this.deselect(file);
    }, (error) => {
      console.log(error);
      this.failure(file, FileAction.Attach);
    });
  }

  delete(file: FilePatient): void {
    const dialogRef = this.dialog.open(DeleteComfirmationDialogComponent, { data: `${file.name}.${file.extension}` });

    dialogRef.afterClosed().pipe(filter(val => val!!)).subscribe(() => {
      this.loading(file, FileAction.Delete);
      this.fileService.deletePatientFile(file, this.options).subscribe(files => {
        this._existingFiles.next(files);
        this.success(file, FileAction.Delete);
      }, (error) => {
        console.log(error);
        this.failure(file, FileAction.Delete);
      });
    });
  }

  dateChange(file: FilePatient, date: Date): void {
    if (file.attachedToRecordID !== undefined) {
      this.loading(file, FileAction.ChangeDate);
      this.fileService.updatePatientFileDate(file, date, this.options).subscribe(files => {
        this._existingFiles.next(files);
        this.success(file, FileAction.ChangeDate);
      }, (error) => {
        console.log(error);
        this.failure(file, FileAction.ChangeDate);
      });
    } else {
      file.documentDate = date;
    }
  }


  typeChange(file: FilePatient, type: FileGroupType): void {
    if (file.attachedToRecordID !== undefined) {
      this.loading(file, FileAction.ChangeType);
      this.fileService.updatePatientFileGroupType(file, type, this.options).subscribe(files => {
        this._existingFiles.next(files);
        this.success(file, FileAction.ChangeType);
      }, (error) => {
        console.log(error);
        this.failure(file, FileAction.ChangeDate);
      });
    } else {
      file.groupTypeID = type.groupTypeID;
      file.groupName = type.groupName;
      file.typeName = type.typeName;
    }
  }

  preview(file: FilePatient): void {
    if (this.isImage(file)) {
      this.dialog.open(ImagePreviewDialogComponent, {
        data: file,
        hasBackdrop: true,
        panelClass: 'image-preview-dialog',
        maxHeight: '90vh',
      });
    } else if (this.isPDF(file)) {
      this.dialog.open(PdfPreviewDialogComponent, {
        data: file,
        hasBackdrop: true,
        panelClass: 'pdf-preview-dialog',
        maxHeight: '90vh',
      });
    }
  }

  filter(search: string): void {
    const groups = this._attachmentTypeGroups.value;
    if (groups && search) {
      const filteredGroups = [ ...groups.map(group => ({ ...group })) ];
      filteredGroups.forEach(group => group.types = group.types.filter((type) => type.typeName.toLowerCase().includes(search.toLowerCase()) || type.groupName.toLowerCase().includes(search.toLowerCase())));
      this._filteredTypeGroups.next(filteredGroups.filter(group => group.types.length > 0));
    } else {
      this._filteredTypeGroups.next(groups);
    }
  }

  clear() {
    this.filterControl.reset();
  }

  name(file: FilePatient): string { return `${file.name}.${file.extension}` }
  isAttached(file: FilePatient): boolean { return file.attachedToRecordID !== undefined }
  isPreviewable(file: FilePatient): boolean { 
    const extension = this._extensions.value!.find(extension => extension.extensionID === file.extensionID);
    return !file.attachedToRecordID && extension!.isPreviewEnabled;
  }
  isImage(file: FilePatient): boolean {
    const extension = this._extensions.value!.find(extension => extension.extensionID === file.extensionID);
    return extension!.description.includes('image');
  }
  isPDF(file: FilePatient): boolean {
    const extension = this._extensions.value!.find(extension => extension.extensionID === file.extensionID);
    console.log(extension);
    return file.extension === 'pdf';
  }

  isLoading(file: FilePatient, action: FileAction): boolean { return this.fileState.has(file) && this.fileState.get(file)!.loading !== undefined && this.fileState.get(file)!.loading!.includes(action) }
  hasFailed(file: FilePatient, action: FileAction): boolean { return this.fileState.has(file) && this.fileState.get(file)!.failed === action }
  hasError(file: FilePatient): boolean { return this.fileState.has(file) && this.fileState.get(file)!.failed !== undefined }
  getError(file: FilePatient): string {
    switch(this.fileState.get(file)!.failed) {
      case FileAction.Attach: return 'Failed to attach file. Please try again';
      case FileAction.Delete: return 'Failed to delete file. Please try again';
      case FileAction.ChangeDate: return 'Failed to update date. Please try again';
      case FileAction.ChangeType: return 'Failed to update type. Please try again';
      default: return '';
    }
  }
  hasInvalidSize(file: FilePatient): boolean {
    if (this.byteSizeLimit && !file.attachedToRecordID) {
      return file.byteSize > this.byteSizeLimit;
    } else {
      return false;
    }
  }
  hasInvalidExtension(file: FilePatient): boolean {
    const type = [ ... new Set(([] as FileGroupType[]).concat(...this._attachmentTypeGroups.value!.map(group => group.types))) ].find(type => type.groupTypeID === file.groupTypeID);
    return type !== undefined && !type.extensionReference.map(ref => ref.extension).includes(file.extension);
  }
  isInvalidExtension(file: FilePatient, type: FileGroupType): boolean {
    return !type.extensionReference.map(ref => ref.extension).includes(file.extension);
  }

  private initialize(): void {
    this._attachmentTypeGroups = new BehaviorSubject<FileTypeGroup[] | null>(null);
    this._filteredTypeGroups = new BehaviorSubject<FileTypeGroup[] | null>(null);
    this._extensions = new BehaviorSubject<FileExtension[] | null>(null);
    this._selectedFiles = new BehaviorSubject<FilePatient[]>([]);
    this._existingFiles = new BehaviorSubject<FilePatient[] | null>(null);
    this.dataSource = new FileDataSource([]);
    this.filterControl.reset();

    if (this.showStatus && !this.displayedColumns.includes('status')) {
      const index = this.displayedColumns.indexOf('size');
      this.displayedColumns.splice(index, 0, 'status');
    }

    this.fileService.getFileGroups(this.workItemID).pipe(
      filter(groupTypes => !!groupTypes),
      tap(groupTypes => {
        const extensions = [ ... new Set(([] as FileExtension[]).concat(...groupTypes.map(groupType => groupType.extensionReference))) ];
        this._extensions.next(extensions);
      }),
      map(groupTypes => {
        const names = new Map(groupTypes!.map(groupType => [groupType.groupID, groupType.groupName]));
        const typeGroups: FileTypeGroup[] = [];
        Array.from(names.keys()).forEach(id => typeGroups.push({ groupName: names.get(id)!, types: groupTypes!.filter(groupType => groupType.groupID === id) }));
        return typeGroups;
      }),
      tap(groups => {
        if (groups.length > 1 && !this.displayedColumns.includes('group')) {
          this._filteredTypeGroups.next(groups);

          const index = this.displayedColumns.indexOf('type');
          this.displayedColumns.splice(index, 0, 'group');
        }
      })
    ).subscribe(this._attachmentTypeGroups);
    
    if (this.mode !== FileMode.uploadonly) {
      this.fileService.getPatientFiles(this.options).subscribe(this._existingFiles);
      this._existingFiles.pipe(val => val!!).subscribe(files => {
        if (files) {
          this.dataSource.setData([ ...this._selectedFiles.value, ...files ]);
        }
      });
    }
    
    this._selectedFiles.subscribe(files => {
      if (this._existingFiles.value) {
        this.dataSource.setData([ ...files, ...this._existingFiles.value! ]);
      } else {
        this.dataSource.setData(files);
      }
    });

    this.filterControl.valueChanges.subscribe((search: string) => this.filter(search));
  }

  private loading(file: FilePatient, action: FileAction): void {
    if (this.fileState.has(file)) {
      const state = this.fileState.get(file);
      if (state!.loading) {
        state!.loading.push(action);
      } else {
        state!.loading = [ action ];
      }

      state!.failed = undefined;
    } else {
      this.fileState.set(file, { loading: [ action ] });
    }
  }

  private success(file: FilePatient, action: FileAction): void {
    const state = this.fileState.get(file);
    
    state!.loading = state!.loading!.filter(loadingAction => loadingAction !== action);

    if (state!.loading.length == 0) {
      this.fileState.delete(file);
    }
  }

  private failure(file: FilePatient, action: FileAction): void {
    const state = this.fileState.get(file);
    state!.failed = action;

    state!.loading = state!.loading!.filter(loadingAction => loadingAction !== action);
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
