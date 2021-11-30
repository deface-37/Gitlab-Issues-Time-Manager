import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-refresh.js';

import { ApolloQueryController } from '@apollo-elements/core';

import { GetMilestones } from './getMilestones.query';
import './Milestone';

@customElement('milestone-list')
export class MilestoneList extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      gap: 10%;
    }

    #refresh-button {
      position: fixed;
      left: 10px;
      top: 50px;
    }
  `;

  private _milestonesController = new ApolloQueryController(this, GetMilestones);

  render() {
    const milestonesList = this._milestonesController?.data?.group?.milestones?.nodes || [];

    return html`
      <sp-action-button id="refresh-button" @click=${this.refreshClickHandler}>
        <sp-icon-refresh slot="icon"></sp-icon-refresh>
      </sp-action-button>
      ${milestonesList.map((milestone) => {
        return html`<milestone-lit title=${milestone.title}></milestone-lit>`;
      })}
    `;
  }

  refreshClickHandler() {
    this._milestonesController.refetch();
  }
}
