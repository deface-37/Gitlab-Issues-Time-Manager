import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import './settings-content';

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
        <sp-dialog-wrapper slot="click-content" dismissable underlay headline="Настройки" size="l">
          <settings-content id="settings-content"></settings-content>
        </sp-dialog-wrapper>
      </overlay-trigger>
    `;
  }
}
