import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getSettings } from './localStorage/settings';

import './components/milestone/milestone-list';
import './components/settings/settings-modal';
import { getNewClient } from './api/apollo-client';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@apollo-elements/components/apollo-client';

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

  render() {
    return html`
      <apollo-client .client=${this.client}>
        <sp-theme color="light" scale="medium">
          <settings-modal></settings-modal>
          <milestone-list></milestone-list>
        </sp-theme>
      </apollo-client>
    `;
  }
}
