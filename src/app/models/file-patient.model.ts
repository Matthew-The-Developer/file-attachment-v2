export interface FilePatient {
  fileID?: number;
  file?: File;
  attachedToRecordID?: number;
  name: string;
  extensionID: number;
  extension: string;
  documentDate?: Date;
  byteSize: number;
  groupTypeID: number;
  typeName: string;
  groupName: string;
  url?: string;
}