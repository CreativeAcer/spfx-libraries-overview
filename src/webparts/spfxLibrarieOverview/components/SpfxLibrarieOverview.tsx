import * as React from 'react';
import styles from './SpfxLibrarieOverview.module.scss';
import { ISpfxLibrarieOverviewProps } from './ISpfxLibrarieOverviewProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class SpfxLibrarieOverview extends React.Component<ISpfxLibrarieOverviewProps, {}> {
  public render(): React.ReactElement<ISpfxLibrarieOverviewProps> {
    return (
      <div className={ styles.spfxLibrarieOverview }>
        
      </div>
    );
  }
}
