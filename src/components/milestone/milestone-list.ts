import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

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
  `;

  private _milestonesController = new ApolloQueryController(this, GetMilestones);

  render() {
    const milestonesList = this._milestonesController?.data?.group?.milestones?.nodes || [];

    return milestonesList.map((milestone) => {
      return html`<milestone-lit title=${milestone.title}></milestone-lit>`;
    });
  }
}
