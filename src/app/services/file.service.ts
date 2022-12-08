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
  workItemID: number = 24;
  getFilesSuccessful: boolean = true;
  createFileSuccessful: boolean = true;
  deleteFileSuccessful: boolean = true;
  updateTypeSuccessful: boolean = true;
  updateDateSuccessful: boolean = true;

  private workItemMap: Map<number, number[]> = new Map<number, number[]>([
    [24, [10]],
    [23, [10, 11, 12]],
    [22, []],
  ])

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
  
  private imageExtensions: FileExtension[] = [
    { extensionID: 0, extension: 'bmp', MIMEType: 'image/bmp', description: 'Standard Windows Bitmap image', isPreviewEnabled: true },
    { extensionID: 1, extension: 'gif', MIMEType: 'image/gif', description: 'Graphics interchange file format', isPreviewEnabled: true },
    { extensionID: 2, extension: 'jpeg', MIMEType: 'image/jpeg', description: 'JPEG bitmap image format file', isPreviewEnabled: true },
    { extensionID: 3, extension: 'jpg', MIMEType: 'image/jpeg', description: 'JPEG bitmap image format file', isPreviewEnabled: true },
  ];
  
  private pdfExtensions: FileExtension[] = [
    { extensionID: 4, extension: 'pdf', MIMEType: 'application/pdf', description: 'Adobe Portable document format', isPreviewEnabled: true },
  ];
  
  private docmentExtensions: FileExtension[] = [    
    { extensionID: 5, extension: 'csv', MIMEType: 'application/vnd.ms-excel', description: 'Comma Separated Value file', isPreviewEnabled: false },
    { extensionID: 6, extension: 'doc', MIMEType: 'application/msword', description: 'Microsoft Word 97 to 2003 document file', isPreviewEnabled: false },
    { extensionID: 7, extension: 'docx', MIMEType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Microsoft Word 2007/2010 Open XML document file', isPreviewEnabled: false },
  ];

  private _groups: BehaviorSubject<FileGroupType[]> = new BehaviorSubject<FileGroupType[]>([
    { groupTypeID: 0, groupID: 0, groupName: 'Dialysis Access', typeID: 0, typeName: 'Access Imaging and Function', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 1, groupID: 0, groupName: 'Dialysis Access', typeID: 1, typeName: 'Access Picture', isEnabled: true, extensionReference: [ ...this.imageExtensions ] },
    { groupTypeID: 2, groupID: 0, groupName: 'Dialysis Access', typeID: 2, typeName: 'Access Procedure and Operative Note', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 3, groupID: 0, groupName: 'Dialysis Access', typeID: 3, typeName: 'Vascular Surgeons Note', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 4, groupID: 0, groupName: 'Dialysis Access', typeID: 4, typeName: 'Access Note', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 5, groupID: 0, groupName: 'Dialysis Access', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 6, groupID: 1, groupName: 'Patient Directive', typeID: 6, typeName: 'Emergency Order', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 7, groupID: 1, groupName: 'Patient Directive', typeID: 7, typeName: 'Code Status', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 8, groupID: 1, groupName: 'Patient Directive', typeID: 8, typeName: 'Living Will', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 9, groupID: 1, groupName: 'Patient Directive', typeID: 9, typeName: 'Power of Attorney', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 10, groupID: 1, groupName: 'Patient Directive', typeID: 10, typeName: 'POLST/Post', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 11, groupID: 1, groupName: 'Patient Directive', typeID: 11, typeName: 'Advanced Directive', isEnabled: true, extensionReference: [ ...this.pdfExtensions ] },
    { groupTypeID: 12, groupID: 1, groupName: 'Patient Directive', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 13, groupID: 2, groupName: 'Care Plan', typeID: 12, typeName: 'Internal', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 14, groupID: 2, groupName: 'Care Plan', typeID: 13, typeName: 'External', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 15, groupID: 2, groupName: 'Care Plan', typeID: 14, typeName: 'Foot Exam', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 16, groupID: 2, groupName: 'Care Plan', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 17, groupID: 3, groupName: 'IDT Assessment', typeID: 12, typeName: 'Internal', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 18, groupID: 3, groupName: 'IDT Assessment', typeID: 13, typeName: 'External', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 19, groupID: 3, groupName: 'IDT Assessment', typeID: 15, typeName: 'Fall Risk', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 20, groupID: 3, groupName: 'IDT Assessment', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 21, groupID: 4, groupName: 'Consent Form', typeID: 16, typeName: 'HIE Opt-in', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 22, groupID: 4, groupName: 'Consent Form', typeID: 17, typeName: 'Hemodialysis Consent', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 23, groupID: 4, groupName: 'Consent Form', typeID: 18, typeName: 'Peritoneal Dialysis Consent', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 24, groupID: 4, groupName: 'Consent Form', typeID: 19, typeName: 'Email Consent', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 25, groupID: 4, groupName: 'Consent Form', typeID: 20, typeName: 'Research Consent', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 26, groupID: 4, groupName: 'Consent Form', typeID: 21, typeName: 'HELPS-HD Intensive', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 27, groupID: 4, groupName: 'Consent Form', typeID: 22, typeName: 'HELPS-HD Usual Care', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 28, groupID: 4, groupName: 'Consent Form', typeID: 23, typeName: 'Hixny', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 29, groupID: 4, groupName: 'Consent Form', typeID: 24, typeName: 'Medication Consent', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 30, groupID: 4, groupName: 'Consent Form', typeID: 25, typeName: 'Declination', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 31, groupID: 4, groupName: 'Consent Form', typeID: 26, typeName: 'Medical Record Release', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 32, groupID: 4, groupName: 'Consent Form', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 33, groupID: 5, groupName: 'Demographic', typeID: 27, typeName: 'Driver\'s License', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 34, groupID: 5, groupName: 'Demographic', typeID: 28, typeName: 'Social Security Card', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 35, groupID: 5, groupName: 'Demographic', typeID: 29, typeName: 'Miscellaneous Insurance', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 36, groupID: 5, groupName: 'Demographic', typeID: 30, typeName: 'Insurance Card', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 37, groupID: 5, groupName: 'Demographic', typeID: 31, typeName: 'CMS 2728', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 38, groupID: 5, groupName: 'Demographic', typeID: 31, typeName: 'CMS 2746', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 39, groupID: 5, groupName: 'Demographic', typeID: 32, typeName: 'COB', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 40, groupID: 5, groupName: 'Demographic', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 41, groupID: 6, groupName: 'Education Material', typeID: 33, typeName: 'Patient Specific', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 42, groupID: 6, groupName: 'Education Material', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 43, groupID: 7, groupName: 'Flowsheet', typeID: 34, typeName: 'In-Center Hemodialysis', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 44, groupID: 7, groupName: 'Flowsheet', typeID: 35, typeName: 'Home Hemodialysis', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 45, groupID: 7, groupName: 'Flowsheet', typeID: 36, typeName: 'Home Peritoneal', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 46, groupID: 7, groupName: 'Flowsheet', typeID: 37, typeName: 'Clinic Visit', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 47, groupID: 7, groupName: 'Flowsheet', typeID: 38, typeName: 'Training', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 48, groupID: 7, groupName: 'Flowsheet', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 49, groupID: 8, groupName: 'Laboratory Report', typeID: 39, typeName: 'Bacteriology', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 50, groupID: 8, groupName: 'Laboratory Report', typeID: 12, typeName: 'Internal', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 51, groupID: 8, groupName: 'Laboratory Report', typeID: 13, typeName: 'External', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 52, groupID: 8, groupName: 'Laboratory Report', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 53, groupID: 9, groupName: 'Medication', typeID: 40, typeName: 'Medication Therapy Management', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 54, groupID: 9, groupName: 'Medication', typeID: 41, typeName: 'Prescription', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 55, groupID: 9, groupName: 'Medication', typeID: 42, typeName: 'Vaccination History', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 56, groupID: 9, groupName: 'Medication', typeID: 43, typeName: 'Medication Assistance', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 57, groupID: 9, groupName: 'Medication', typeID: 44, typeName: 'Medication', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 58, groupID: 9, groupName: 'Medication', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 59, groupID: 10, groupName: 'Transplantation', typeID: 45, typeName: 'Evaluation', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 60, groupID: 10, groupName: 'Transplantation', typeID: 46, typeName: 'Activation letter', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 61, groupID: 10, groupName: 'Transplantation', typeID: 47, typeName: 'Declination letter', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 62, groupID: 10, groupName: 'Transplantation', typeID: 48, typeName: 'Deactivation letter', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 63, groupID: 10, groupName: 'Transplantation', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 64, groupID: 11, groupName: 'Profile Picture', typeID: 49, typeName: 'Patient Profile Picture', isEnabled: true, extensionReference: [ ...this.imageExtensions ] },
    { groupTypeID: 65, groupID: 11, groupName: 'Profile Picture', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 66, groupID: 12, groupName: 'Quality of Life', typeID: 50, typeName: 'KDOQL', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 67, groupID: 12, groupName: 'Quality of Life', typeID: 51, typeName: 'SF36', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 68, groupID: 12, groupName: 'Quality of Life', typeID: 52, typeName: 'SF36+24', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 69, groupID: 12, groupName: 'Quality of Life', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 70, groupID: 13, groupName: 'Medical records Internal', typeID: 53, typeName: 'Tuberculosis Screening Sheet', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 71, groupID: 13, groupName: 'Medical records Internal', typeID: 54, typeName: 'COVID screening sheet', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 72, groupID: 13, groupName: 'Medical records Internal', typeID: 55, typeName: 'Standing Order', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 73, groupID: 13, groupName: 'Medical records Internal', typeID: 56, typeName: 'Protocol Order', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 74, groupID: 13, groupName: 'Medical records Internal', typeID: 57, typeName: 'Non-access Image', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 75, groupID: 13, groupName: 'Medical records Internal', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 76, groupID: 14, groupName: 'Medical records External', typeID: 58, typeName: 'Discharge Summary', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 77, groupID: 14, groupName: 'Medical records External', typeID: 59, typeName: 'ER Note / ED Evaluation', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 78, groupID: 14, groupName: 'Medical records External', typeID: 60, typeName: 'Eye Exam', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 79, groupID: 14, groupName: 'Medical records External', typeID: 61, typeName: 'Miscellaneous Operative Note', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 80, groupID: 14, groupName: 'Medical records External', typeID: 62, typeName: 'Pathology Report', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 81, groupID: 14, groupName: 'Medical records External', typeID: 63, typeName: 'Procedure Note', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 82, groupID: 14, groupName: 'Medical records External', typeID: 64, typeName: 'Radiology Report', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 83, groupID: 14, groupName: 'Medical records External', typeID: 65, typeName: 'Skilled Nursing Facility and Nursing Home', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 84, groupID: 14, groupName: 'Medical records External', typeID: 66, typeName: 'External Progress Note', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 85, groupID: 14, groupName: 'Medical records External', typeID: 67, typeName: 'History and Physical', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 86, groupID: 14, groupName: 'Medical records External', typeID: 68, typeName: 'Transfer Summary', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 87, groupID: 14, groupName: 'Medical records External', typeID: 69, typeName: 'Home Health', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 88, groupID: 14, groupName: 'Medical records External', typeID: 70, typeName: 'New Patient Intake', isEnabled: true, extensionReference: [ ...this.pdfExtensions, ...this.docmentExtensions ] },
    { groupTypeID: 89, groupID: 14, groupName: 'Medical records External', typeID: 5, typeName: 'Miscellaneous', isEnabled: true, extensionReference: [ ...this.imageExtensions, ...this.pdfExtensions, ...this.docmentExtensions ] },
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

  getFileGroups(workItemId?: number): Observable<FileGroupType[]> {
    

    if (workItemId) {
      const groupIDs = this.workItemMap.get(workItemId)!;

      if (groupIDs.length > 0) {
        return this._groups.asObservable().pipe(
          map(groups => groups.filter(group => groupIDs.includes(group.groupID))),
          delay(3000)
        );
      }
    }
    return this._groups.asObservable().pipe(delay(5000));
  }
}
