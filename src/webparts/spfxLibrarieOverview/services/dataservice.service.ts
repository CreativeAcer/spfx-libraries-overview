import { IDataService } from "../interfaces/dataservice.interface";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp/presets/all";
import ErrorHandler from "../helpers/errorhandler";

export default class DataService implements IDataService {
    //private _treeBuilder: TreeBuilder;

    constructor(protected context: WebPartContext){
      //this._treeBuilder = new TreeBuilder();
    }

    public async checkIfListAlreadyExists(listName: string): Promise<boolean> {
      try{
        let list = await sp.web.lists.getByTitle(listName).get();
        if (list) {
          return Promise.resolve(true);
        }
      } catch(error){
        if (error.status === 404) {
          return Promise.resolve(false);
        }
        else {
          return ErrorHandler.handleError(error);
        }
      }
    }

    public async getAllLibraries(): Promise<any> {
      try{
        let libs = await sp.web.lists();
        if (libs) {
          return Promise.resolve(libs);
        }
      } catch(error){
        if (error.status === 404) {
          return Promise.resolve(error);
        }
        else {
          return ErrorHandler.handleError(error);
        }
      }
    }
}