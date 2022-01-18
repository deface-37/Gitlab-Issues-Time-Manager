import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './style.scss';
import { settingsVar } from './vars/settings-var';
import { getNewClient } from './api/apollo-client';

import './components/header/main-header';
import './components/milestone/milestone-list';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@apollo-elements/components/apollo-client';

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

    document.addEventListener('refetch-all', () => {
      this._client.refetchQueries({
        include: 'all',
      });
    });

    document.addEventListener('changed-url', () => {
      const settings = settingsVar();
      this._client = getNewClient(settings.url);
    });
  }
}
