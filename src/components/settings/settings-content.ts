import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getSettings, saveSettings, Settings } from '../../localStorage/settings';
import { settingsVar } from '../../vars/settings-var';

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

  settings = getSettings();

  render() {
    return html`
      <sp-field-label for="url" size="XL">URL</sp-field-label>
      <sp-textfield
        id="url"
        value=${this.settings.url}
        placeholder="Введите URL"
        @change=${this.changeUrlHandler}
      ></sp-textfield>

      <sp-field-label for="token" size="XL">Токен аутентификации</sp-field-label>
      <sp-textfield
        id="token"
        type="password"
        value=${this.settings.personalToken}
        placeholder="Введите токен аутентификации"
        @change=${this.createChangeInputHandler('personalToken')}
      ></sp-textfield>

      <sp-field-label for="group" size="XL">Группа проектов</sp-field-label>
      <sp-textfield
        id="group"
        value=${this.settings.groupName}
        @change=${this.createChangeInputHandler('groupName')}
      ></sp-textfield>
    `;
  }

  changeUrlHandler(event: Event) {
    this.createChangeInputHandler('url')(event);

    document.dispatchEvent(new CustomEvent('changed-url'));
  }

  createChangeInputHandler(settingName: keyof Settings) {
    return (ev: Event) => {
      const value = (ev.currentTarget as HTMLInputElement).value;
      this.settings[settingName] = value;

      settingsVar(this.settings);
      saveSettings(this.settings);
    };
  }
}
