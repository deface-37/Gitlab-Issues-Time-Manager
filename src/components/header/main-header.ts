import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';

import '../settings/settings-button-wrapper';

@customElement('main-header')
export class MainHeader extends LitElement {
  static styles = [
    css`
      sp-top-nav {
        margin-left: 50px;
        margin-right: 10px;
      }

      settings-button-wrapper {
        margin-left: auto;
      }

      sp-theme {
        background-color: var(--spectrum-global-color-gray-100);
        color: var(--spectrum-global-color-gray-900);
      }
    `,
  ];

  render() {
    return html`
      <sp-theme color="lightest" scale="medium">
        <sp-top-nav size="l">
          <sp-top-nav-item id="plan-tab" href="#">Планирование</sp-top-nav-item>

          <settings-button-wrapper></settings-button-wrapper>
        </sp-top-nav>
      </sp-theme>
    `;
  }
}
