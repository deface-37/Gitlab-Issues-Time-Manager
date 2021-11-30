import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './components/milestone/milestone-list';
import './components/settings/settings-modal';
import { getNewClient } from './api/apollo-client';
import api from './api/api.json';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';

import '@apollo-elements/components/apollo-client';

@customElement('app-lit')
export class AppLit extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @property({ attribute: false })
  client = getNewClient(api.url, '');

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
