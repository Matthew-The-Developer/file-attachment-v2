export interface FileGroupType {
  groupTypeID: number;
  groupID: number;
  groupName: string;
  typeID: number;
  typeName: string;
}

export interface FileTypeGroup {
  groupName: string;
  types: FileGroupType[];
}