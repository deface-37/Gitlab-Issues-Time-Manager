import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/status-light/sp-status-light.js';

import './status-light'
import './update-status'

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
        align-items: center;
        padding-right: 10px;
        gap: 10px;
      }
    `,
  ];


  render() {
    return html`
      <sp-theme color="lightest" scale="medium">
        <update-status></update-status>
        <status-light></status-light>
      </sp-theme>
    `;
  }
}
