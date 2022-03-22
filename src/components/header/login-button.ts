import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import { ApolloQueryController } from '@apollo-elements/core';
import { GetAuth } from '../../apollo/state/auth.query';
import auth from '../../auth/authFlow';

@customElement('login-button')
export class LoginButton extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  private authController = new ApolloQueryController(this, GetAuth);

  get isLoggedIn() {
    return this.authController.data?.auth?.isLoggedIn;
  }

  @state()
  private loginInProgress = false;

  render() {
    const text = this.isLoggedIn ? 'Выйти' : 'Войти';
    const clickHandler = this.isLoggedIn ? this.logoutButtonHandler : this.loginButtonHandler;

    return html`
      <sp-menu-item ?disabled=${this.loginInProgress} @click=${clickHandler}>${text}</sp-menu-item>
    `;
  }

  private loginButtonHandler() {
    this.loginInProgress = true;
    auth.makeAuthRequest().finally(() => {
      this.loginInProgress = false;
    });
  }
  private logoutButtonHandler() {
    auth.revokeToken();
  }
}
