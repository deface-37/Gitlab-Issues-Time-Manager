import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import '../settings/settings-content';
import '@spectrum-web-components/menu/sp-menu-item.js';
import { Overlay } from '@spectrum-web-components/overlay';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('settings-button-wrapper')
export class SettingsModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @query('sp-dialog-wrapper', true)
  private dialogWrapper: HTMLElement;
  @state()
  private displayDialog = false;

  render() {
    const displayStyle = this.displayDialog ? null : 'none';
    return html`
      <sp-menu-item @click=${this._clickHandler}>Настройки</sp-menu-item>
      <sp-dialog-wrapper
        dismissable
        underlay
        headline="Настройки"
        size="l"
        style=${styleMap({ display: displayStyle })}
        @close=${() => (this.displayDialog = false)}
      >
        <settings-content id="settings-content"></settings-content>
      </sp-dialog-wrapper>
    `;
  }

  private _clickHandler() {
    this.displayDialog = true;
    Overlay.open(this, 'click', this.dialogWrapper, { placement: 'none' });
  }
}
