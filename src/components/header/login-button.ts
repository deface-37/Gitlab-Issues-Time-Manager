import { authVar } from './../../apollo/vars';
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import { ReactiveVariableController } from '@apollo-elements/core';
import { type AuthFlow, authContext } from '../../contexts/auth-context';
import { consume } from '@lit/context';

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

  @consume({ context: authContext })
  private auth?: AuthFlow;

  render() {
    const text = this.isLoggedIn ? 'Выйти' : 'Войти';
    const clickHandler = this.isLoggedIn ? this.logoutButtonHandler : this.loginButtonHandler;

    return html`
      <sp-menu-item ?disabled=${this.loginInProgress} @click=${clickHandler}>${text}</sp-menu-item>
    `;
  }

  private loginButtonHandler() {
    this.loginInProgress = true;
    this.auth?.makeAuthRequest().finally(() => {
      this.loginInProgress = false;
    });
  }
  private logoutButtonHandler() {
    this.auth?.revokeToken();
  }
}
