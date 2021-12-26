import { Textfield } from '@spectrum-web-components/textfield';
import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/field-label/sp-field-label.js';

import { getSettings } from '../../localStorage/settings';

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
      personalToken: this.tokenInput.value,
      groupName: this.groupInput.value,
    };
  }
  private initSettings = getSettings();

  @query('#url', true)
  private urlInput: Textfield;

  @query('#token', true)
  private tokenInput: Textfield;

  @query('#group', true)
  private groupInput: Textfield;

  render() {
    return html`
      <sp-field-label for="url" size="XL">URL</sp-field-label>
      <sp-textfield id="url" value=${this.initSettings.url} placeholder="Enter url"></sp-textfield>

      <sp-field-label for="token" size="XL">Токен</sp-field-label>
      <sp-textfield
        id="token"
        type="password"
        value=${this.initSettings.personalToken}
        placeholder="Enter token"
      ></sp-textfield>

      <sp-field-label for="group" size="XL">Группа проектов</sp-field-label>
      <sp-textfield id="group" value=${this.initSettings.groupName}></sp-textfield>
    `;
  }
}
