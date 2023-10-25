import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-data-refresh.js';
import '@spectrum-web-components/action-menu/sp-action-menu.js';
import { REFETCH_ALL } from '../../eventNames';

@customElement('update-button')
export class UpdateButton extends LitElement {
  render() {
    return html`
        <sp-action-button slot="trigger" quiet @click=${this._clickHandler}>
          <sp-icon-data-refresh slot="icon"></sp-icon-data-refresh>
          <sp-tooltip self-managed placement="bottom" >Обновить данные</sp-tooltip>
        </sp-action-button>
    `;
  }

  private _clickHandler() {
    document.dispatchEvent(new CustomEvent(REFETCH_ALL));
  }
}
