import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/button/sp-clear-button.js';

import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { saveSettings, Settings } from '../../localStorage/settings';
import { settingsVar } from '../../apollo/vars';
import { URL_UPDATED } from '../../eventNames';

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

  settings = settingsVar();

  render() {
    return html`
      <sp-field-label for="url" size="XL">URL</sp-field-label>
      <sp-textfield
        id="url"
        value=${this.settings.url}
        placeholder="Введите URL"
        @change=${this.changeUrlHandler}
      ></sp-textfield>

      <sp-field-label for="group" size="XL">Группа проектов</sp-field-label>
      <sp-textfield
        id="group"
        value=${this.settings.groupName}
        @change=${this.createChangeInputHandler('groupName')}
      ></sp-textfield>
    `;
  }

  private changeUrlHandler(event: Event) {
    this.createChangeInputHandler('url')(event);

    document.dispatchEvent(new CustomEvent(URL_UPDATED));
  }

  private createChangeInputHandler(settingName: keyof Settings) {
    return (ev: Event) => {
      const value = (ev.currentTarget as HTMLInputElement).value;
      this.settings = { ...this.settings, [settingName]: value };

      settingsVar(this.settings);
      saveSettings(this.settings);
    };
  }
}
