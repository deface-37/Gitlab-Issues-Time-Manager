import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-refresh.js';
import '@spectrum-web-components/progress-circle/sp-progress-circle.js';

import { absoluteCentred } from '../../styles/common.css';
import { GetMilestones } from './getMilestones.query';
import './Milestone';
import { queryControllerWithClient } from '../../apollo/controllerWithClient';

@customElement('milestone-list')
export class MilestoneList extends LitElement {
  static styles = [
    absoluteCentred,
    css`
      :host {
        position: relative;
        display: flex;
        justify-content: start;
        gap: 50px;
        overflow-x: scroll;
        padding: 20px 20px 5px;
        box-sizing: border-box;
      }

      milestone-lit {
        flex: 1 0 300px;
        max-width: 400px;
        height: 100%;
      }
    `,
  ];

  private _milestonesController = queryControllerWithClient(this, GetMilestones);

  private get milestones() {
    return this._milestonesController.data?.group?.milestones?.nodes || [];
  }

  render() {
    if (this._milestonesController.networkStatus < 7)
      return html`<sp-progress-circle class="absolute-centred" indeterminate></sp-progress-circle>`;

    return html`
      ${this.milestones.map((milestone) => {
        return html`<milestone-lit title=${milestone.title}></milestone-lit>`;
      })}
    `;
  }
}
