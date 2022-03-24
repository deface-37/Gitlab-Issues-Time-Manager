import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './style.scss';
import { settingsVar } from './apollo/vars';
import { getNewClient } from './apollo/client';

import './components/header/main-header';
import './components/milestone/milestone-list';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@apollo-elements/components/apollo-client';
import { REFETCH_ALL, URL_UPDATED } from './eventNames';

@customElement('app-lit')
export class AppLit extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
    }

    apollo-client,
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

  @state()
  private _client = getNewClient(settingsVar().url);

  render() {
    return html`
      <apollo-client .client=${this._client}>
        <sp-theme color="light" scale="medium">
          <main-header></main-header>
          <milestone-list></milestone-list>
        </sp-theme>
      </apollo-client>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener(REFETCH_ALL, () => {
      this._client.refetchQueries({
        include: 'all',
      });
    });

    document.addEventListener(URL_UPDATED, () => {
      const settings = settingsVar();
      this._client = getNewClient(settings.url);
    });
  }
}
