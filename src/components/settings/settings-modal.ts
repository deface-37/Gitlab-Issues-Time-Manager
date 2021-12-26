import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';

import { DialogWrapper } from '@spectrum-web-components/dialog';

import './settings-content';
import { SettingsContent } from './settings-content';
import { AppLit } from '../../App';
import { saveSettings } from '../../localStorage/settings';
import { getNewClient } from '../../api/apollo-client';

@customElement('settings-modal')
export class SettingsModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    #settings-button {
      position: fixed;
      left: 10px;
      top: 10px;
      z-index: 1;
    }
  `;

  render() {
    return html`
      <overlay-trigger placement="none" type="modal">
        <sp-action-button slot="trigger" id="settings-button">
          <sp-icon-settings slot="icon" size="xl"></sp-icon-settings>
          Settings
        </sp-action-button>
        <sp-dialog-wrapper
          @close=${this.closeHandler}
          slot="click-content"
          dismissable
          underlay
          headline="Настройки"
          size="l"
        >
          <settings-content id="settings-content"></settings-content>
        </sp-dialog-wrapper>
      </overlay-trigger>
    `;
  }

  closeHandler(ev: Event): void {
    const dialog = ev.currentTarget as DialogWrapper;
    const settingsNode = dialog.querySelector('#settings-content') as SettingsContent;
    if (!settingsNode) {
      return;
    }
    const settings = settingsNode.settings;
    const app = document.getElementById('app') as AppLit;

    app.client = getNewClient(settings.url, settings.personalToken);
    app.groupName = settings.groupName;

    saveSettings(settings);
  }
}
