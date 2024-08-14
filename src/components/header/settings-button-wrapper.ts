import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../settings/settings-content';

import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/overlay/sp-overlay.js';

@customElement('settings-button-wrapper')
export class SettingsModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;
  render() {
    return html`
      <div>
        <sp-menu-item id="trigger">Настройки</sp-menu-item>
        <sp-overlay trigger="trigger@click">
          <sp-dialog-wrapper dismissable underlay headline="Настройки" size="l">
            <settings-content id="settings-content"></settings-content>
          </sp-dialog-wrapper>
        </sp-overlay>
      </div>
    `;
  }
}
