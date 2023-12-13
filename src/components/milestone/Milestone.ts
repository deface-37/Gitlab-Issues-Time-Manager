import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { formatIssueTime } from '../../helpers/format-helper';

import { GetIssues } from '../Issues/issue.query';

import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-refresh.js';
import '@spectrum-web-components/divider/sp-divider.js';
import '@spectrum-web-components/progress-circle/sp-progress-circle.js';

import { absoluteCentred } from '../../styles/common.css';
import { getCurrentUserQuery } from '../../apollo/getCurrentUser.query';

import '../Issues/IssuesList';
import '../common/Loader';
import { queryControllerWithClient } from '../../apollo/controllerWithClient';
import { ISSUE_HIDDEN, ISSUE_DISPLAY } from '../../eventNames';

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
  title!: string;

  @state()
  private _excludeIssuesList = new Set<string>();

  constructor() {
    super();

    this.addEventListener(ISSUE_HIDDEN, (e) => {
      this._excludeIssuesList.add(e.detail);
      this.requestUpdate();
    });

    this.addEventListener(ISSUE_DISPLAY, (e) => {
      this._excludeIssuesList.delete(e.detail);
      this.requestUpdate();
    });
  }

  _userController = queryControllerWithClient(this, getCurrentUserQuery, {
    onData: (data) => {
      if (this._issuesController.variables) {
        this._issuesController.variables = {
          ...this._issuesController.variables,
          currentUser: data.currentUser?.username || '',
        };
      }
    },
  });

  _issuesController = queryControllerWithClient(this, GetIssues, {
    variables: {
      milestone: this.title,
      currentUser: this._userController.data?.currentUser?.username || '',
      groupName: '',
    },
  });

  private get _filteredIssue() {
    return this._issuesList.filter((issue) => !this._excludeIssuesList.has(issue.id));
  }

  private _getTotalSpentTime(): string {
    const timeInSeconds = this._filteredIssue.reduce((totalTime, issue) => {
      return totalTime + issue.totalTimeSpent;
    }, 0);

    return formatIssueTime(timeInSeconds);
  }

  private _getTotalEstimatedTime(): string {
    const timeInSeconds = this._filteredIssue.reduce((totalTime, issue) => {
      return totalTime + issue.timeEstimate;
    }, 0);

    return formatIssueTime(timeInSeconds);
  }

  willUpdate(props: Map<string, unknown>) {
    if (props.has('title') && this._issuesController.variables) {
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
      this._issuesController.loading || this._issuesController.networkStatus < 7
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
          <sp-icon-refresh size="s" slot="icon"></sp-icon-refresh>
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
