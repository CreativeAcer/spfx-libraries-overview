export interface IDataService {
 checkIfListAlreadyExists(listName: string): Promise<boolean>;
 getAllLibraries(): Promise<any>;
}


// onclick?: () => ImageData;