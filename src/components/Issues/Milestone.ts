import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatIssueTime } from '../../helpers/format-helper';

import { ApolloQueryController } from '@apollo-elements/core';
import { GetIssues, GetIssuesQueryData } from '../../api/issue.query';

import './IssuesList';
import '../common/Loader';

@customElement('milestone-lit')
export default class MilestoneLit extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 300px;
      border: 1px solid black;
      height: 90vh;
      box-sizing: border-box;
      margin: 5vh auto;
      padding: 10px;
      border-radius: 5px;
    }

    h2 {
      margin: 0;
    }

    #title {
      border-bottom: 2px solid black;
      margin-bottom: 15px;
    }

    issues-list,
    loader-lit {
      flex-grow: 1;
    }
  `;

  @property()
  title: string;

  private _apolloIssues = new ApolloQueryController(this, GetIssues);
  private _issuesList: readonly {
    readonly __typename?: 'Issue';
    readonly iid: string;
    readonly id: string;
    readonly totalTimeSpent: number;
    readonly timeEstimate: number;
    readonly webUrl: string;
    readonly closedAt?: any;
    readonly title: string;
  }[];

  private _clickHandler() {
    this._apolloIssues.refetch({ milestone: this.title });
    this.requestUpdate();
  }

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

  willUpdate(props: Map<string, any>) {
    // Делаем запрос когда поменялся заголовок вехи
    if (props.has('title')) {
      this._apolloIssues.refetch({ milestone: this.title });
    }
  }

  render() {
    this._issuesList = this._apolloIssues.data?.group?.issues?.nodes || [];

    const issuesList = this._apolloIssues.loading
      ? html`<loader-lit></loader-lit>`
      : html`<issues-list .issues=${this._issuesList}></issues-list>`;

    return html`
      <div id="title">
        <h2>${this.title}</h2>
        <button
          @click=${this._clickHandler}
          ?disabled=${this._apolloIssues.loading}
        >
          Запросить задачи
        </button>
      </div>
      <div>Error: ${this._apolloIssues.error}</div>
      <div>Errors: ${this._apolloIssues.errors}</div>
      ${issuesList}
      <div class="totalTime">
        <div>Всего потрачено: ${this._getTotalSpentTime()}</div>
        <div>Всего оценено: ${this._getTotalEstimatedTime()}</div>
      </div>
    `;
  }
}
