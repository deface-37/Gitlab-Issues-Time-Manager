import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

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

  render() {
    return html`
      <sp-field-label for="URL" size="XL">URL</sp-field-label>
      <sp-textfield class="config" id="url" placeholder="Enter url"></sp-textfield>

      <sp-field-label for="token" size="XL">Token</sp-field-label>
      <sp-textfield class="config" id="token" placeholder="Enter token"></sp-textfield>
    `;
  }
}
