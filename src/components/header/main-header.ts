import { settingsVar } from './../../apollo/vars';
import './login-button';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/icons-workflow/icons/sp-icon-data-refresh.js';
import '@spectrum-web-components/avatar/sp-avatar.js';
import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import '@spectrum-web-components/action-menu/sp-action-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-user.js';
import './settings-button-wrapper';
import '@spectrum-web-components/popover/sp-popover.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import { getCurrentUserQuery } from '../../apollo/getCurrentUser.query';
import { ApolloQueryController } from '@apollo-elements/core';
import { GetAuth } from '../../apollo/state/auth.query';
import { REFETCH_ALL } from '../../eventNames';

@customElement('main-header')
export class MainHeader extends LitElement {
  static styles = [
    css`
      sp-top-nav {
        margin-left: 50px;
        margin-right: 20px;
      }

      .right {
        margin-left: auto;
      }

      sp-theme {
        background-color: var(--spectrum-global-color-gray-100);
        color: var(--spectrum-global-color-gray-900);
      }
    `,
  ];

  private userController = new ApolloQueryController(this, getCurrentUserQuery);
  private authController = new ApolloQueryController(this, GetAuth);

  render() {
    const additonalUrl = this.userController.data?.currentUser?.avatarUrl;
    const settings = settingsVar();

    const avatar = this.authController.data?.auth?.isLoggedIn
      ? html`<sp-avatar
          slot="icon"
          size="400"
          src=${new URL(additonalUrl, settings.url).href}
        ></sp-avatar>`
      : html`<sp-icon-user slot="icon"></sp-icon-user>`;

    return html`
      <sp-theme color="lightest" scale="medium">
        <sp-top-nav size="l">
          <sp-top-nav-item id="plan-tab" href="#">Планирование</sp-top-nav-item>

          <sp-action-button class="right" quiet @click=${this.refreshButtonHandler}>
            <sp-icon-data-refresh slot="icon"></sp-icon-data-refresh>
          </sp-action-button>
          <sp-action-menu id="menu" size="m">
            ${avatar}
            <settings-button-wrapper></settings-button-wrapper>
            <login-button></login-button>
          </sp-action-menu>
        </sp-top-nav>
      </sp-theme>
    `;
  }

  private refreshButtonHandler() {
    document.dispatchEvent(new CustomEvent(REFETCH_ALL));
  }
}
