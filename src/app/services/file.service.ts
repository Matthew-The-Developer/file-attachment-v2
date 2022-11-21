import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, mergeMap, Observable, of, throwError } from 'rxjs';
import { FileExtension } from '../models/file-extension.model';
import { FileGroupType } from '../models/file-group-type.model';
import { FileMode } from '../models/file-mode.enum';
import { FilePatient } from '../models/file-patient.model';
import { FileRequestOptions } from '../models/file-request-options.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  fileMode: FileMode = FileMode.uploadonly;
  getFilesSuccessful: boolean = true;
  createFileSuccessful: boolean = true;
  deleteFileSuccessful: boolean = true;
  updateTypeSuccessful: boolean = true;
  updateDateSuccessful: boolean = true;

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
      groupName: 'Transplantation',
      typeName: 'Evaluation',
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
      groupName: 'Transplantation',
      typeName: 'Activation letter',
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
      groupName: 'Transplantation',
      typeName: 'Declination letter',
      url: './assets/example03.docx'
    },
  ]);

  private _groups: BehaviorSubject<FileGroupType[]> = new BehaviorSubject<FileGroupType[]>([
    { groupTypeID: 0, groupID: 0, groupName: 'Dialysis Access', typeID: 0, typeName: 'Access Imaging and Function' },
    { groupTypeID: 1, groupID: 0, groupName: 'Dialysis Access', typeID: 1, typeName: 'Access Picture' },
    { groupTypeID: 2, groupID: 0, groupName: 'Dialysis Access', typeID: 2, typeName: 'Access Procedure and Operative Note' },
    { groupTypeID: 3, groupID: 0, groupName: 'Dialysis Access', typeID: 3, typeName: 'Vascular Surgeons Note' },
    { groupTypeID: 4, groupID: 0, groupName: 'Dialysis Access', typeID: 4, typeName: 'Access Note' },
    { groupTypeID: 5, groupID: 0, groupName: 'Dialysis Access', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 6, groupID: 1, groupName: 'Patient Directive', typeID: 6, typeName: 'Emergency Order' },
    { groupTypeID: 7, groupID: 1, groupName: 'Patient Directive', typeID: 7, typeName: 'Code Status' },
    { groupTypeID: 8, groupID: 1, groupName: 'Patient Directive', typeID: 8, typeName: 'Living Will' },
    { groupTypeID: 9, groupID: 1, groupName: 'Patient Directive', typeID: 9, typeName: 'Power of Attorney' },
    { groupTypeID: 10, groupID: 1, groupName: 'Patient Directive', typeID: 10, typeName: 'POLST/Post' },
    { groupTypeID: 11, groupID: 1, groupName: 'Patient Directive', typeID: 11, typeName: 'Advanced Directive' },
    { groupTypeID: 12, groupID: 1, groupName: 'Patient Directive', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 13, groupID: 2, groupName: 'Care Plan', typeID: 12, typeName: 'Internal' },
    { groupTypeID: 14, groupID: 2, groupName: 'Care Plan', typeID: 13, typeName: 'External' },
    { groupTypeID: 15, groupID: 2, groupName: 'Care Plan', typeID: 14, typeName: 'Foot Exam' },
    { groupTypeID: 16, groupID: 2, groupName: 'Care Plan', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 17, groupID: 3, groupName: 'IDT Assessment', typeID: 12, typeName: 'Internal' },
    { groupTypeID: 18, groupID: 3, groupName: 'IDT Assessment', typeID: 13, typeName: 'External' },
    { groupTypeID: 19, groupID: 3, groupName: 'IDT Assessment', typeID: 15, typeName: 'Fall Risk' },
    { groupTypeID: 20, groupID: 3, groupName: 'IDT Assessment', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 21, groupID: 4, groupName: 'Consent Form', typeID: 16, typeName: 'HIE Opt-in' },
    { groupTypeID: 22, groupID: 4, groupName: 'Consent Form', typeID: 17, typeName: 'Hemodialysis Consent' },
    { groupTypeID: 23, groupID: 4, groupName: 'Consent Form', typeID: 18, typeName: 'Peritoneal Dialysis Consent' },
    { groupTypeID: 24, groupID: 4, groupName: 'Consent Form', typeID: 19, typeName: 'Email Consent' },
    { groupTypeID: 25, groupID: 4, groupName: 'Consent Form', typeID: 20, typeName: 'Research Consent' },
    { groupTypeID: 26, groupID: 4, groupName: 'Consent Form', typeID: 21, typeName: 'HELPS-HD Intensive' },
    { groupTypeID: 27, groupID: 4, groupName: 'Consent Form', typeID: 22, typeName: 'HELPS-HD Usual Care' },
    { groupTypeID: 28, groupID: 4, groupName: 'Consent Form', typeID: 23, typeName: 'Hixny' },
    { groupTypeID: 29, groupID: 4, groupName: 'Consent Form', typeID: 24, typeName: 'Medication Consent' },
    { groupTypeID: 30, groupID: 4, groupName: 'Consent Form', typeID: 25, typeName: 'Declination' },
    { groupTypeID: 31, groupID: 4, groupName: 'Consent Form', typeID: 26, typeName: 'Medical Record Release' },
    { groupTypeID: 32, groupID: 4, groupName: 'Consent Form', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 33, groupID: 5, groupName: 'Demographic', typeID: 27, typeName: 'Driver\'s License' },
    { groupTypeID: 34, groupID: 5, groupName: 'Demographic', typeID: 28, typeName: 'Social Security Card' },
    { groupTypeID: 35, groupID: 5, groupName: 'Demographic', typeID: 29, typeName: 'Miscellaneous Insurance' },
    { groupTypeID: 36, groupID: 5, groupName: 'Demographic', typeID: 30, typeName: 'Insurance Card' },
    { groupTypeID: 37, groupID: 5, groupName: 'Demographic', typeID: 31, typeName: 'CMS 2728' },
    { groupTypeID: 38, groupID: 5, groupName: 'Demographic', typeID: 31, typeName: 'CMS 2746' },
    { groupTypeID: 39, groupID: 5, groupName: 'Demographic', typeID: 32, typeName: 'COB' },
    { groupTypeID: 40, groupID: 5, groupName: 'Demographic', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 41, groupID: 6, groupName: 'Education Material', typeID: 33, typeName: 'Patient Specific' },
    { groupTypeID: 42, groupID: 6, groupName: 'Education Material', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 43, groupID: 7, groupName: 'Flowsheet', typeID: 34, typeName: 'In-Center Hemodialysis' },
    { groupTypeID: 44, groupID: 7, groupName: 'Flowsheet', typeID: 35, typeName: 'Home Hemodialysis' },
    { groupTypeID: 45, groupID: 7, groupName: 'Flowsheet', typeID: 36, typeName: 'Home Peritoneal' },
    { groupTypeID: 46, groupID: 7, groupName: 'Flowsheet', typeID: 37, typeName: 'Clinic Visit' },
    { groupTypeID: 47, groupID: 7, groupName: 'Flowsheet', typeID: 38, typeName: 'Training' },
    { groupTypeID: 48, groupID: 7, groupName: 'Flowsheet', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 49, groupID: 8, groupName: 'Laboratory Report', typeID: 39, typeName: 'Bacteriology' },
    { groupTypeID: 50, groupID: 8, groupName: 'Laboratory Report', typeID: 12, typeName: 'Internal' },
    { groupTypeID: 51, groupID: 8, groupName: 'Laboratory Report', typeID: 13, typeName: 'External' },
    { groupTypeID: 52, groupID: 8, groupName: 'Laboratory Report', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 53, groupID: 9, groupName: 'Medication', typeID: 40, typeName: 'Medication Therapy Management' },
    { groupTypeID: 54, groupID: 9, groupName: 'Medication', typeID: 41, typeName: 'Prescription' },
    { groupTypeID: 55, groupID: 9, groupName: 'Medication', typeID: 42, typeName: 'Vaccination History' },
    { groupTypeID: 56, groupID: 9, groupName: 'Medication', typeID: 43, typeName: 'Medication Assistance' },
    { groupTypeID: 57, groupID: 9, groupName: 'Medication', typeID: 44, typeName: 'Medication' },
    { groupTypeID: 58, groupID: 9, groupName: 'Medication', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 59, groupID: 10, groupName: 'Transplantation', typeID: 45, typeName: 'Evaluation' },
    { groupTypeID: 60, groupID: 10, groupName: 'Transplantation', typeID: 46, typeName: 'Activation letter' },
    { groupTypeID: 61, groupID: 10, groupName: 'Transplantation', typeID: 47, typeName: 'Declination letter' },
    { groupTypeID: 62, groupID: 10, groupName: 'Transplantation', typeID: 48, typeName: 'Deactivation letter' },
    { groupTypeID: 63, groupID: 10, groupName: 'Transplantation', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 64, groupID: 11, groupName: 'Profile Picture', typeID: 49, typeName: 'Patient Profile Picture' },
    { groupTypeID: 65, groupID: 11, groupName: 'Profile Picture', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 66, groupID: 12, groupName: 'Quality of Life', typeID: 50, typeName: 'KDOQL' },
    { groupTypeID: 67, groupID: 12, groupName: 'Quality of Life', typeID: 51, typeName: 'SF36' },
    { groupTypeID: 68, groupID: 12, groupName: 'Quality of Life', typeID: 52, typeName: 'SF36+24' },
    { groupTypeID: 69, groupID: 12, groupName: 'Quality of Life', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 70, groupID: 13, groupName: 'Medical records Internal', typeID: 53, typeName: 'Tuberculosis Screening Sheet' },
    { groupTypeID: 71, groupID: 13, groupName: 'Medical records Internal', typeID: 54, typeName: 'COVID screening sheet' },
    { groupTypeID: 72, groupID: 13, groupName: 'Medical records Internal', typeID: 55, typeName: 'Standing Order' },
    { groupTypeID: 73, groupID: 13, groupName: 'Medical records Internal', typeID: 56, typeName: 'Protocol Order' },
    { groupTypeID: 74, groupID: 13, groupName: 'Medical records Internal', typeID: 57, typeName: 'Non-access Image' },
    { groupTypeID: 75, groupID: 13, groupName: 'Medical records Internal', typeID: 5, typeName: 'Miscellaneous' },
    { groupTypeID: 76, groupID: 14, groupName: 'Medical records External', typeID: 58, typeName: 'Discharge Summary' },
    { groupTypeID: 77, groupID: 14, groupName: 'Medical records External', typeID: 59, typeName: 'ER Note / ED Evaluation' },
    { groupTypeID: 78, groupID: 14, groupName: 'Medical records External', typeID: 60, typeName: 'Eye Exam' },
    { groupTypeID: 79, groupID: 14, groupName: 'Medical records External', typeID: 61, typeName: 'Miscellaneous Operative Note' },
    { groupTypeID: 80, groupID: 14, groupName: 'Medical records External', typeID: 62, typeName: 'Pathology Report' },
    { groupTypeID: 81, groupID: 14, groupName: 'Medical records External', typeID: 63, typeName: 'Procedure Note' },
    { groupTypeID: 82, groupID: 14, groupName: 'Medical records External', typeID: 64, typeName: 'Radiology Report' },
    { groupTypeID: 83, groupID: 14, groupName: 'Medical records External', typeID: 65, typeName: 'Skilled Nursing Facility and Nursing Home' },
    { groupTypeID: 84, groupID: 14, groupName: 'Medical records External', typeID: 66, typeName: 'External Progress Note' },
    { groupTypeID: 85, groupID: 14, groupName: 'Medical records External', typeID: 67, typeName: 'History and Physical' },
    { groupTypeID: 86, groupID: 14, groupName: 'Medical records External', typeID: 68, typeName: 'Transfer Summary' },
    { groupTypeID: 87, groupID: 14, groupName: 'Medical records External', typeID: 69, typeName: 'Home Health' },
    { groupTypeID: 88, groupID: 14, groupName: 'Medical records External', typeID: 70, typeName: 'New Patient Intake' },
    { groupTypeID: 89, groupID: 14, groupName: 'Medical records External', typeID: 5, typeName: 'Miscellaneous' },
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
    if (this.getFilesSuccessful) {
      return this._files.asObservable().pipe(delay(5000));
    } else {
      return this._files.asObservable().pipe(delay(5000), mergeMap(t => throwError(() => new Error())));
    }
  }

  createPatientFile(file: FilePatient, options: FileRequestOptions): Observable<FilePatient[]> {
    // return of(true).pipe(delay(5000), mergeMap(t => throwError(() => new Error())));
    if (this.createFileSuccessful) {
      this._files.next([{ ...file, attachedToRecordID: Math.floor(Math.random() * (99999 - 10200 + 1) + 10200) }, ...this._files.value]);
      return this.getPatientFiles(options);
    } else {
      return this.getPatientFiles(options).pipe(delay(5000), mergeMap(t => throwError(() => new Error())));
    }
  }

  deletePatientFile(fileToRemove: FilePatient, options: FileRequestOptions): Observable<FilePatient[]> {
    if (this.deleteFileSuccessful) {
      this._files.next(this._files.value.filter(file => file !== fileToRemove));
      return this.getPatientFiles(options);
    } else {
      return this.getPatientFiles(options).pipe(delay(5000), mergeMap(t => throwError(() => new Error())));
    }
  }

  updatePatientFileGroupType(fileToUpdate: FilePatient, type: FileGroupType, options: FileRequestOptions): Observable<FilePatient[]> {
    if (this.updateTypeSuccessful) {
      const files = this._files.value;
      const index = files.findIndex(file => file === fileToUpdate);
      files[index].groupTypeID = type.groupTypeID;
      files[index].groupName = type.groupName;
      files[index].typeName = type.typeName;
  
      this._files.next(files);
      return this.getPatientFiles(options);
    } else {
      return this.getPatientFiles(options).pipe(delay(5000), mergeMap(t => throwError(() => new Error())));
    }
  }

  updatePatientFileDate(fileToUpdate: FilePatient, date: Date, options: FileRequestOptions): Observable<FilePatient[]> {
    if (this.updateDateSuccessful) {
      const files = this._files.value;
      const index = files.findIndex(file => file === fileToUpdate);
      files[index].documentDate = date;
  
      this._files.next(files);
      return this.getPatientFiles(options);
    } else {
      return this.getPatientFiles(options).pipe(delay(5000), mergeMap(t => throwError(() => new Error())));
    }

  }

  getFileGroups(groupIDs: number[] = []): Observable<FileGroupType[]> {
    if (groupIDs.length > 0) {
      return this._groups.asObservable().pipe(
        map(groups => groups.filter(group => groupIDs.includes(group.groupID))),
        delay(3000)
      );
    } else {
      return this._groups.asObservable().pipe(delay(5000));
    }
  }

  getFileExtensions(): Observable<FileExtension[]> {
    return this._extensions.asObservable().pipe(delay(5000));
  }
}
