import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import './style.css';
import { client } from './apollo/client';

import './components/header/main-header';
import './components/milestone/milestone-list';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import { REFETCH_ALL } from './eventNames';

@customElement('app-lit')
export class AppLit extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
    }

    sp-theme {
      height: 100%;
    }

    sp-theme {
      background-color: var(--spectrum-global-color-gray-100);
      color: var(--spectrum-global-color-gray-900);
      display: flex;
      flex-direction: column;
    }

    main-header {
      flex: 0, 0 auto;
    }

    milestone-list {
      flex: 1 1 auto;
    }
  `;

  constructor() {
    super();
    // Чтобы корректно работал overlay
    window.toString = () => '[object Window]';
  }

  render() {
    return html`
      <sp-theme color="light" scale="medium">
        <main-header></main-header>
        <milestone-list></milestone-list>
      </sp-theme>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener(REFETCH_ALL, () => {
      client.refetchQueries({
        include: 'all',
      });
    });
  }
}
