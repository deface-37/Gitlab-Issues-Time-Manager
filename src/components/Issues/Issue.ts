import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatIssueTime } from '../../helpers/format-helper';

@customElement('issue-lit')
export default class IssueLit extends LitElement {
  @property()
  title!: string;
  @property({ type: Number })
  spent!: number;
  @property({ type: Number })
  estimated!: number;

  static styles = css`
    :host {
      border: 3px solid black;
      display: block;
      padding: 5px;
      border-radius: 15px;
    }

    h3 {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  `;

  render() {
    return html`
      <h3>${this.title}</h3>
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
