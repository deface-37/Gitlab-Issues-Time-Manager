import { authVar } from './../../apollo/vars';
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import auth from '../../auth/authFlow';
import { ReactiveVariableController } from '@apollo-elements/core';

@customElement('login-button')
export class LoginButton extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  private authController = new ReactiveVariableController(this, authVar);

  get isLoggedIn() {
    return this.authController.value.isLoggedIn;
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
