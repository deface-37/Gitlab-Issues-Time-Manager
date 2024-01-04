import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/status-light/sp-status-light.js';

import './status-light'

@customElement('status-footer')
export class StatusFooter extends LitElement {
  static styles = [
    css`
      sp-theme {
        background-color: var(--spectrum-global-color-gray-100);
        color: var(--spectrum-global-color-gray-900);
        height: 100%;

        display: flex;
        justify-content: end;
        margin-right: 20px;
      }
    `,
  ];


  render() {
    return html`
      <sp-theme color="lightest" scale="medium">
        <status-light></status-light>
      </sp-theme>
    `;
  }
}
