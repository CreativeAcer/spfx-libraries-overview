import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpfxLibrarieOverviewWebPartStrings';
import SpfxLibrarieOverview from './components/SpfxLibrarieOverview';
import { ISpfxLibrarieOverviewProps } from './components/ISpfxLibrarieOverviewProps';

import { sp } from "@pnp/sp/presets/all";
import { isEqual, isEmpty } from '@microsoft/sp-lodash-subset';
import DataService from './services/dataservice.service';
import MockDataService from './services/mockservice.service';
import { IDataService } from './interfaces/dataservice.interface';

export interface ISpfxLibrarieOverviewWebPartProps {
  description: string;
}

export default class SpfxLibrarieOverviewWebPart extends BaseClientSideWebPart<ISpfxLibrarieOverviewWebPartProps> {
  private _loadingIndicator = false;
  private _initComplete = false;
  private _placeholder = null;
  private _dataService: IDataService;
  private _SPLibraryCollection: any[] = [];

  public async render(): Promise<void> {
    if (!this._initComplete) {
      return;
    }

    if (this.displayMode === DisplayMode.Edit) {
      const { Placeholder } = await import(
          /* webpackChunkName: 'search-property-pane' */
          '@pnp/spfx-controls-react/lib/Placeholder'
      );
      this._placeholder = Placeholder;
    }

    this.renderCompleted();
  }

  protected renderCompleted(): void {
    super.renderCompleted();

    let renderElement: React.ReactElement<ISpfxLibrarieOverviewProps> = null;

    if (this._isWebPartConfigured()) {
      const element: React.ReactElement<ISpfxLibrarieOverviewProps> = React.createElement(
        SpfxLibrarieOverview,
        {
          description: this.properties.description
        }
      );
      renderElement = element;
    } else {
      if (this.displayMode === DisplayMode.Edit) {
          const placeholder: React.ReactElement<any> = React.createElement(
              this._placeholder,
              {
                  iconName: strings.placeholderIconName,
                  iconText: strings.placeholderName,
                  description: strings.placeholderDescription,
                  buttonLabel: strings.placeholderbtnLbl,
                  onConfigure: this._setupWebPart.bind(this)
              }
          );
          renderElement = placeholder;
      } else {
          renderElement = React.createElement('div', null);
      }
    }

    ReactDom.render(renderElement, this.domElement);
  }

  public async onInit(): Promise<void> {
    if (Environment.type in [EnvironmentType.Local, EnvironmentType.Test]) {
      this._dataService = new MockDataService();
    }
    else {
      this._dataService = new DataService(this.context);
    }

    this._initializeRequiredProperties();
    sp.setup({
      spfxContext: this.context
    });
    this._SPLibraryCollection = await this._dataService.getAllLibraries();

    this._initComplete = true;

    return super.onInit();
      
  }
  private _initializeRequiredProperties() {
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _isWebPartConfigured(): boolean {
    return !isEmpty({});
  }

  private _setupWebPart() {
    this.context.propertyPane.open();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      showLoadingIndicator: this._loadingIndicator,
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneSlider(strings.AmountColumns, {
                  label: strings.lblAmountColumns,
                  value:  3,
                  min:  1,
                  max: 10
                })
              ]
            }
          ],
          displayGroupsAsAccordion: true
        }
      ]
    };
  }
}
