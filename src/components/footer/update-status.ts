import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@spectrum-web-components/icons-workflow/icons/sp-icon-assets-downloaded.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

@customElement('update-status')
export class UpdateStatus extends LitElement {
  static styles = [css``];

  @state()
  private _downloaded: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    window.updater.downloaded.then(() => (this._downloaded = true));
  }

  // TODO: добавить индикатор ожидания на загрузку обновления
  // TODO: убрать индикатор обновления, пока нет доступных обновлений
  // TODO: добавить описание новой версии
  render() {
    return html`
      <sp-button
        icon-only
        size="s"
        variant="accent"
        ?disabled=${!this._downloaded}
        @click=${() => window.updater.quitAndUpdate()}
      >
        <sp-icon-assets-downloaded slot="icon"></sp-icon-assets-downloaded>
        <sp-tooltip self-managed>Перезапустить и обновить</sp-tooltip>
      </sp-button>
    `;
  }
}
