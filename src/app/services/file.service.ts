import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, mergeMap, Observable, of, throwError } from 'rxjs';
import { FileExtension } from '../models/file-extension.model';
import { FileGroupType } from '../models/file-group-type.model';
import { FilePatient } from '../models/file-patient.model';
import { FileRequestOptions } from '../models/file-request-options.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private _files: BehaviorSubject<FilePatient[]> = new BehaviorSubject<FilePatient[]>([
    {
      fileID: 0,
      attachedToRecordID: 122324,
      name: 'pdf-test',
      extensionID: 4,
      extension: 'pdf',
      documentDate: new Date(1659762822100),
      byteSize: 2534446,
      groupTypeID: 1,
      groupName: 'Transplant',
      typeName: 'Activation',
      url: 'https://github.com/Matthew-The-Developer/file-attachment/blob/master/src/assets/pdf-test.pdf'
    },
    {
      fileID: 0,
      attachedToRecordID: 122324,
      name: 'Programming-Memes-Programmer-while-sleeping',
      extensionID: 3,
      extension: 'jpg',
      documentDate: new Date(1661779977375),
      byteSize: 59868,
      groupTypeID: 0,
      groupName: 'Transplant',
      typeName: 'Acceptance',
      url: 'https://www.thecoderpedia.com/wp-content/uploads/2020/06/Programming-Memes-Programmer-while-sleeping.jpg?x34900'
    },
    {
      fileID: 0,
      attachedToRecordID: 122324,
      name: 'example03',
      extensionID: 7,
      extension: 'docx',
      documentDate: new Date(1659672717869),
      byteSize: 108816,
      groupTypeID: 3,
      groupName: 'Transplant',
      typeName: 'Deactivation',
      url: './assets/example03.docx'
    },
  ]);

  private _groups: BehaviorSubject<FileGroupType[]> = new BehaviorSubject<FileGroupType[]>([
    { groupTypeID: 0, groupID: 0, groupName: 'Transplant', typeID: 0, typeName: 'Acceptance' },
    { groupTypeID: 1, groupID: 0, groupName: 'Transplant', typeID: 1, typeName: 'Activation' },
    { groupTypeID: 2, groupID: 0, groupName: 'Transplant', typeID: 2, typeName: 'Declination' },
    { groupTypeID: 3, groupID: 0, groupName: 'Transplant', typeID: 3, typeName: 'Deactivation' },
    { groupTypeID: 4, groupID: 1, groupName: 'Patient', typeID: 4, typeName: 'Profile Picture' },
    { groupTypeID: 5, groupID: 1, groupName: 'Patient', typeID: 5, typeName: 'Insurance Card' },
    { groupTypeID: 6, groupID: 1, groupName: 'Patient', typeID: 6, typeName: 'HIPPA Wavier' },
    { groupTypeID: 7, groupID: 2, groupName: 'Billing', typeID: 7, typeName: 'Treatment List' },
    { groupTypeID: 8, groupID: 2, groupName: 'Billing', typeID: 8, typeName: 'In House Treatment' },
  ]);

  private _extensions: BehaviorSubject<FileExtension[]> = new BehaviorSubject<FileExtension[]>([
    { extensionID: 0, extension: 'bmp', MIMEType: 'image/bmp', description: 'Standard Windows Bitmap image' },
    { extensionID: 1, extension: 'gif', MIMEType: 'image/gif', description: 'Graphics interchange file format' },
    { extensionID: 2, extension: 'jpeg', MIMEType: 'image/jpeg', description: 'JPEG bitmap image format file' },
    { extensionID: 3, extension: 'jpg', MIMEType: 'image/jpeg', description: 'JPEG bitmap image format file' },
    { extensionID: 4, extension: 'pdf', MIMEType: 'application/pdf', description: 'Adobe Portable document format' },
    { extensionID: 5, extension: 'csv', MIMEType: 'application/vnd.ms-excel', description: 'Comma Separated Value file' },
    { extensionID: 6, extension: 'doc', MIMEType: 'application/msword', description: 'Microsoft Word 97 to 2003 document file' },
    { extensionID: 7, extension: 'docx', MIMEType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Microsoft Word 2007/2010 Open XML document file' },
  ]);

  constructor() { }

  getPatientFiles(options: FileRequestOptions): Observable<FilePatient[]> {
    return this._files.asObservable().pipe(delay(5000));
  }

  createPatientFile(file: FilePatient, options: FileRequestOptions): Observable<FilePatient[]> {
    return of(true).pipe(delay(5000), mergeMap(t => throwError(() => new Error())));
    // this._files.next([file, ...this._files.value]);
    // return this.getPatientFiles(options);
  }

  deletePatientFile(fileToRemove: FilePatient, options: FileRequestOptions): Observable<FilePatient[]> {
    this._files.next(this._files.value.filter(file => file !== fileToRemove));
    return this.getPatientFiles(options);
  }

  updatePatientFileGroupType(fileToUpdate: FilePatient, type: FileGroupType, options: FileRequestOptions): Observable<FilePatient[]> {
    const files = this._files.value;
    const index = files.findIndex(file => file === fileToUpdate);
    files[index].groupTypeID = type.groupTypeID;
    files[index].groupName = type.groupName;
    files[index].typeName = type.typeName;

    this._files.next(files);
    return this.getPatientFiles(options);
  }

  updatePatientFileDate(fileToUpdate: FilePatient, date: Date, options: FileRequestOptions): Observable<FilePatient[]> {
    const files = this._files.value;
    const index = files.findIndex(file => file === fileToUpdate);
    files[index].documentDate = date;

    this._files.next(files);
    return this.getPatientFiles(options);
  }

  getFileGroups(groupIDs: number[] = []): Observable<FileGroupType[]> {
    if (groupIDs.length > 0) {
      return this._groups.asObservable().pipe(
        map(groups => groups.filter(group => groupIDs.includes(group.groupID))),
        delay(500)
      );
    } else {
      return this._groups.asObservable().pipe(delay(5000));
    }
  }

  getFileExtensions(): Observable<FileExtension[]> {
    return this._extensions.asObservable().pipe(delay(5000));
  }
}
