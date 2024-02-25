import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import './style.css';
import { client } from './apollo/client';

import './components/header/main-header';
import './components/milestone/milestone-list';
import './components/footer/footer';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import { REFETCH_ALL } from './eventNames';

import { authContext } from './contexts/auth-context';
import { AuthFlow } from './auth/authFlow';
import { provide } from '@lit/context';
import { settingsVar } from './apollo/vars';
import { getSettings } from './localStorage/settings';

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
      background-color: var(--spectrum-gray-100);
      color: var(--spectrum-gray-800);
      display: flex;
      flex-direction: column;
    }

    main-header {
      flex:
        0,
        0 auto;
    }

    milestone-list {
      flex: 1 1 auto;
    }

    status-footer {
      flex: 0 0 20px;
    }
  `;

  @provide({ context: authContext })
  authFlow = new AuthFlow(getSettings());

  constructor() {
    super();
    settingsVar(getSettings());
    window.updater.initAutoUpdate();
  }

  render() {
    return html`
      <sp-theme color="light" scale="medium" theme="spectrum">
        <main-header></main-header>
        <milestone-list></milestone-list>
        <status-footer></status-footer>
      </sp-theme>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(REFETCH_ALL, this.onRefetch);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener(REFETCH_ALL, this.onRefetch);
  }

  private onRefetch() {
    client.refetchQueries({
      include: 'all',
    });
  }
}
