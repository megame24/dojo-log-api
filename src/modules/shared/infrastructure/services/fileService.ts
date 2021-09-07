export interface FileService {
  uploadFile: (file: any) => Promise<string>;
}

export class FileServiceImpl implements FileService {
  async uploadFile(file: any): Promise<string> {
    // TODO:
    // - Impose a size limit
    // upload to the cloud
    console.log(file);
    return "https://images.unsplash.com/photo-1620927165388-1c463be175cc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=613&q=80";
  }
}
