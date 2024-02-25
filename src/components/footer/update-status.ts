import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('update-status')
export class UpdateStatus extends LitElement {
  static styles = [css``];

  @state()
  private _downloaded: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    window.updater.addOnDownloaded(this._onDownloaded);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.updater.removeOnDownloaded(this._onDownloaded);
  }

  private _onDownloaded(): void {
    this._downloaded = true;
  }

  render() {
    return html`
      <sp-button ?disabled=${!this._downloaded} @click=${() => window.updater.quitAndUpdate()}>
        <sp-icon-alert slot="icon"></sp-icon-alert>
        Перезапустить и обновить
      </sp-button>
    `;
  }
}
