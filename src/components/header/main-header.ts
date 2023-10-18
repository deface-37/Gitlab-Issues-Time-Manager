import './update-button';
import { settingsVar, authVar } from './../../apollo/vars';
import './login-button';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/avatar/sp-avatar.js';
import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-user.js';
import './settings-button-wrapper';
import '@spectrum-web-components/popover/sp-popover.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import { getCurrentUserQuery } from '../../apollo/getCurrentUser.query';
import { queryControllerWithClient } from '../../apollo/controllerWithClient';
import { ReactiveVariableController } from '@apollo-elements/core';

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

      /* Размер иконки в кнопке */
      sp-avatar {
        --mod-actionbutton-icon-size: var(--spectrum-avatar-size-400);
      }
    `,
  ];

  private userController = queryControllerWithClient(this, getCurrentUserQuery);
  private authController = new ReactiveVariableController(this, authVar);

  render() {
    const additonalUrlForAvatar = this.userController.data?.currentUser?.avatarUrl;
    const settings = settingsVar();

    const hasAvatar = this.authController.value.isLoggedIn && additonalUrlForAvatar;
    const avatar = hasAvatar
      ? html`<sp-avatar
          slot="icon"
          size="400"
          src=${new URL(additonalUrlForAvatar, settings.url).href}
        ></sp-avatar>`
      : html`<sp-icon-user slot="icon"></sp-icon-user>`;

      // const avatar = html`<sp-icon-user slot="icon"></sp-icon-user>`;

    return html`
      <sp-theme color="lightest" scale="medium">
        <sp-top-nav size="l">
          <sp-top-nav-item id="plan-tab" href="#">Планирование</sp-top-nav-item>
          <update-button class="right"></update-button>
          <sp-action-menu id="menu" size="m" quiet static="white">
            ${avatar}
            <settings-button-wrapper></settings-button-wrapper>
            <login-button></login-button>
          </sp-action-menu>
        </sp-top-nav>
      </sp-theme>
    `;
  }
}
