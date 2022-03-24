import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-data-refresh.js';
import '@spectrum-web-components/action-menu/sp-action-menu.js';
import { Overlay } from '@spectrum-web-components/overlay';
import { REFETCH_ALL } from '../../eventNames';

@customElement('update-button')
export class UpdateButton extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      sp-tooltip:not([open]) {
        display: none;
      }
    `,
  ];

  @query('sp-tooltip')
  private tooltip: HTMLElement;
  private overlayClose: Promise<() => void>;

  render() {
    return html`
      <sp-action-button
        slot="trigger"
        id="refresh-button"
        quiet
        @click=${this._clickHandler}
        @mouseover=${this._mouseOverHandler}
        @mouseout=${this._mouseOutHandler}
      >
        <sp-icon-data-refresh slot="icon"></sp-icon-data-refresh>
      </sp-action-button>
      <sp-tooltip slot="hover-content">Обновить данные</sp-tooltip>
    `;
  }

  private _clickHandler() {
    document.dispatchEvent(new CustomEvent(REFETCH_ALL));
  }

  private _mouseOverHandler() {
    this.overlayClose = Overlay.open(this, 'hover', this.tooltip, {
      placement: 'bottom',
      delayed: true,
    });
  }

  private _mouseOutHandler() {
    this.overlayClose?.then((close) => {
      close();
    });
  }
}
