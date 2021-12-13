import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-refresh.js';
import '@spectrum-web-components/progress-circle/sp-progress-circle.js';

import { ApolloQueryController } from '@apollo-elements/core';

import { absoluteCentred } from '../../styles/common.css';
import { GetMilestones } from './getMilestones.query';
import './Milestone';

@customElement('milestone-list')
export class MilestoneList extends LitElement {
  static styles = [
    absoluteCentred,
    css`
      :host {
        position: relative;
        display: flex;
        justify-content: center;
        gap: 10%;
        height: 90%;
      }

      #refresh-button {
        position: fixed;
        left: 10px;
        top: 50px;
        z-index: 1;
      }
    `,
  ];

  private _milestonesController = new ApolloQueryController(this, GetMilestones);

  private get milestones() {
    return this._milestonesController?.data?.group?.milestones?.nodes || [];
  }

  render() {
    const loader = this._milestonesController.loading
      ? html`<sp-progress-circle class="absolute-centred" indeterminate></sp-progress-circle>`
      : '';

    return html`
      <sp-action-button id="refresh-button" @click=${this.refreshClickHandler}>
        <sp-icon-refresh slot="icon"></sp-icon-refresh>
      </sp-action-button>
      ${this.milestones.map((milestone) => {
        return html`<milestone-lit title=${milestone.title}></milestone-lit>`;
      })}
      ${loader}
    `;
  }

  refreshClickHandler() {
    this._milestonesController.refetch();
  }
}
