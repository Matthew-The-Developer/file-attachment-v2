import { FileAction } from "./file-action.enum";

export interface FileState {
  loading?: FileAction[];
  failed?: FileAction;
}