import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatIssueTime } from '../../helpers/format-helper';

import '@spectrum-web-components/link/sp-link.js';

@customElement('issue-lit')
export default class IssueLit extends LitElement {
  @property()
  title!: string;
  @property({ type: Number })
  spent!: number;
  @property({ type: Number })
  estimated!: number;
  @property()
  id: string;
  @property()
  iid: string;
  @property()
  url: string;
  @property({ type: Boolean })
  closed: boolean;

  static styles = css`
    :host {
      border: 2px solid black;
      display: block;
      padding: 5px;
      border-radius: 15px;
    }

    :host([closed]) {
      background-color: var(--spectrum-global-color-gray-300);
    }

    h3 {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  `;

  render() {
    return html`
      <h3>
        <sp-link target="_blank" href=${this.url} variant="secondary" quiet>
          #${this.iid} ${this.title} ${this.closed ? '(closed)' : ''}</sp-link
        >
      </h3>
      <div>Потрачено: ${formatIssueTime(this.spent)}</div>
      <div>Оценено: ${formatIssueTime(this.estimated)}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'issue-lit': IssueLit;
  }
}
