import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './style.scss';
import { getSettings } from './localStorage/settings';

import './components/milestone/milestone-list';
import './components/settings/settings-modal';
import { getNewClient } from './api/apollo-client';
import { getUser } from './api/getCurrentUser.query';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@apollo-elements/components/apollo-client';
import { ApolloQueryController } from '@apollo-elements/core';

@customElement('app-lit')
export class AppLit extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
    }

    apollo-client,
    sp-theme {
      height: 100%;
    }

    sp-theme {
      background-color: var(--spectrum-global-color-gray-100);
      color: var(--spectrum-global-color-gray-900);
    }
  `;

  private _settings = getSettings();

  @property({ attribute: false })
  client = getNewClient(this._settings.url, this._settings.personalToken);

  @property({ attribute: false })
  groupName = this._settings.groupName;

  render() {
    return html`
      <apollo-client .client=${this.client}>
        <sp-theme color="light" scale="medium">
          <settings-modal></settings-modal>
          <milestone-list group-name=${this.groupName}></milestone-list>
        </sp-theme>
      </apollo-client>
    `;
  }
}
