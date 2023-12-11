import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatIssueTime } from '../../helpers/format-helper';

import '@spectrum-web-components/link/sp-link.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-visibility-off.js';
import { ISSUE_DISPLAY, ISSUE_HIDDEN } from '../../eventNames';

@customElement('issue-lit')
export default class IssueLit extends LitElement {
  @property()
  title!: string;
  @property({ type: Number })
  spent!: number;
  @property({ type: Number })
  estimated!: number;
  @property()
  id!: string;
  @property()
  iid!: string;
  @property()
  url!: string;
  @property({ type: Boolean })
  closed = false;

  static styles = css`
    :host {
      border: 2px solid black;
      display: block;
      padding: 5px;
      border-radius: 15px;
      position: relative;
    }

    :host([closed]) {
      background-color: var(--spectrum-global-color-gray-300);
    }

    h3 {
      margin-top: 5px;
      margin-bottom: 5px;
    }

    sp-action-button {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    :host([data-hidden]) {
      background: repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5) 1px,
        transparent 1px,
        transparent 5px
      );
    }
  `;

  @property({ type: Boolean, attribute: 'data-hidden', reflect: true })
  dataHidden: boolean = false;

  render() {
    return html`
      <sp-action-button quiet size="s" toggles @change=${this._clickHandler}>
        <sp-icon-visibility-off slot="icon"></sp-icon-visibility-off>
      </sp-action-button>
      <h3>
        <sp-link target="_blank" href=${this.url} variant="secondary" quiet>
          #${this.iid} ${this.title} ${this.closed ? '(closed)' : ''}</sp-link
        >
      </h3>
      <div>Потрачено: ${formatIssueTime(this.spent)}</div>
      <div>Оценено: ${formatIssueTime(this.estimated)}</div>
    `;
  }

  private _clickHandler() {
    this.dataHidden = !this.dataHidden;

    if (this.dataHidden) {
      this.dispatchEvent(
        new CustomEvent(ISSUE_HIDDEN, {
          detail: this.id,
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      this.dispatchEvent(
        new CustomEvent(ISSUE_DISPLAY, {
          detail: this.id,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'issue-lit': IssueLit;
  }
}
