import { Textfield } from '@spectrum-web-components/textfield';
import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/field-label/sp-field-label.js';

@customElement('settings-content')
export class SettingsContent extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      sp-textfield {
        --spectrum-alias-single-line-width: 60%;
      }
    `,
  ];

  get settings() {
    return {
      url: this.urlInput.value,
      token: this.tokenInput.value,
    };
  }

  @query('#url', true)
  private urlInput: Textfield;

  @query('#token', true)
  private tokenInput: Textfield;

  render() {
    return html`
      <sp-field-label for="URL" size="XL">URL</sp-field-label>
      <sp-textfield class="config" id="url" placeholder="Enter url"></sp-textfield>

      <sp-field-label for="token" size="XL">Token</sp-field-label>
      <sp-textfield class="config" id="token" placeholder="Enter token"></sp-textfield>
    `;
  }
}
