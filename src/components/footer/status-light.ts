import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('status-light')
export class StatusLight extends LitElement {
  static styles = [css``];

  @state()
  private _isOnline = window.navigator.onLine;

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('online', this.onChangeOnline);
    window.addEventListener('offline', this.onChangeOnline);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('online', this.onChangeOnline);
    window.removeEventListener('offline', this.onChangeOnline);
  }

  onChangeOnline = () => {
    this._isOnline = window.navigator.onLine;
  };

  render() {
    return this._isOnline
      ? html`<sp-status-light variant="positive"></sp-status-light>`
      : html`<sp-status-light variant="negative"
          >Отсутствует подключение к интернету</sp-status-light
        >`;
  }
}
