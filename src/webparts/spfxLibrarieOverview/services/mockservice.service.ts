import { IDataService } from "../interfaces/dataservice.interface";
import { IListAddResult } from "@pnp/sp/lists/types";

export default class MockDataService implements IDataService {


  public checkIfListAlreadyExists(listName: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  public GetSPLists(): Promise<any> {
      return Promise.resolve([{
        Id: 1,
        Title: "List One",
        ParentWebUrl: "string",
        NavUrl: "string"
      }]);

  }

  public async getAllLibraries(): Promise<any> {
    return Promise.resolve(true);
  }

    
}