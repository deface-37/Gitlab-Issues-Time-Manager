import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './style.scss';
import { settingsVar } from './vars/settings-var';

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

  @state()
  private _client = getNewClient(settingsVar().url);

  @state()
  private _groupName = settingsVar().groupName;

  render() {
    return html`
      <apollo-client .client=${this._client}>
        <sp-theme color="light" scale="medium">
          <settings-modal></settings-modal>
          <milestone-list group-name=${this._groupName}></milestone-list>
        </sp-theme>
      </apollo-client>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener('changed-url', () => {
      const settings = settingsVar();
      this._client = getNewClient(settings.url);
    });
  }
}
