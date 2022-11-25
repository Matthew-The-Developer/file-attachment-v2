import { FileExtension } from "./file-extension.model";

export interface FileGroupType {
  groupTypeID: number;
  groupID: number;
  groupName: string;
  typeID: number;
  typeName: string;
  isEnabled: boolean;
  extensionReference: FileExtension[];
}

export interface FileTypeGroup {
  groupName: string;
  types: FileGroupType[];
}