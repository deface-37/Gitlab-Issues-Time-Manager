import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../settings/settings-content';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/overlay/overlay-trigger';

@customElement('settings-button-wrapper')
export class SettingsModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;
  render() {
    return html`
      <overlay-trigger type="modal" placement="none">
        <sp-menu-item slot="trigger">Настройки</sp-menu-item>
        <sp-dialog-wrapper slot="click-content" dismissable underlay headline="Настройки" size="l">
          <settings-content id="settings-content"></settings-content>
        </sp-dialog-wrapper>
      </overlay-trigger>
    `;
  }
}
