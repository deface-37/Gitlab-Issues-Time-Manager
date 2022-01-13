import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatIssueTime } from '../../helpers/format-helper';

import { ApolloQueryController } from '@apollo-elements/core';
import { GetIssues } from '../Issues/issue.query';

import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-refresh.js';
import '@spectrum-web-components/divider/sp-divider.js';
import '@spectrum-web-components/progress-circle/sp-progress-circle.js';

import { absoluteCentred } from '../../styles/common.css';
import { getUser } from '../../api/getCurrentUser.query';

import '../Issues/IssuesList';
import '../common/Loader';

@customElement('milestone-lit')
export default class MilestoneLit extends LitElement {
  static styles = [
    absoluteCentred,
    css`
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid black;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 5px;
        position: relative;
      }

      h2 {
        margin: 0;
      }

      #title {
        border-bottom: 2px solid black;
        padding-bottom: 5px;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
      }

      issues-list,
      loader-lit {
        flex-grow: 1;
      }
    `,
  ];

  @property()
  title: string;

  _userController = new ApolloQueryController(this, getUser, {
    onData: (data) => {
      this._issuesController.variables = {
        ...this._issuesController.variables,
        currentUser: data.currentUser.username,
      };
    },
  });

  _issuesController = new ApolloQueryController(this, GetIssues, {
    variables: {
      milestone: this.title,
      groupName: null,
      currentUser: this._userController.data?.currentUser.username,
    },
  });

  private _getTotalSpentTime(): string {
    const timeInSeconds = this._issuesList.reduce((totalTime, issue) => {
      return totalTime + issue.totalTimeSpent;
    }, 0);

    return formatIssueTime(timeInSeconds);
  }

  private _getTotalEstimatedTime(): string {
    const timeInSeconds = this._issuesList.reduce((totalTime, issue) => {
      return totalTime + issue.timeEstimate;
    }, 0);

    return formatIssueTime(timeInSeconds);
  }

  willUpdate(props: Map<string, unknown>) {
    if (props.has('title')) {
      this._issuesController.variables = {
        ...this._issuesController.variables,
        milestone: this.title,
      };
    }
  }

  get _issuesList() {
    return this._issuesController.data?.group?.issues?.nodes || [];
  }

  render() {
    const issuesList =
      this._issuesController.networkStatus < 7
        ? html`<sp-progress-circle class="absolute-centred" indeterminate></sp-progress-circle>`
        : html`<issues-list .issues=${this._issuesList}></issues-list>`;

    const error = this._issuesController.error
      ? html`<div>Error: ${this._issuesController.error}</div>`
      : '';

    const errors =
      this._issuesController.errors.length != 0
        ? html`<div>Errors: ${this._issuesController.errors}</div>`
        : '';

    return html`
      <div id="title">
        <h2>${this.title}</h2>
        <sp-action-button
          id="refresh-button"
          @click=${this._clickHandler}
          ?disabled=${this._issuesController.networkStatus < 7}
        >
          <sp-icon-refresh slot="icon"></sp-icon-refresh>
        </sp-action-button>
      </div>
      ${[error, errors, issuesList]}
      <div class="totalTime">
        <div>Всего потрачено: ${this._getTotalSpentTime()}</div>
        <div>Всего оценено: ${this._getTotalEstimatedTime()}</div>
      </div>
    `;
  }

  private _clickHandler() {
    this._issuesController.refetch();
    this.requestUpdate();
  }
}
