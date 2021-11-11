import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IssuesController } from '../../controllers/IssueApiController';
import { formatIssueTime } from '../../helpers/format-helper';
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
  private _issues = new IssuesController(this);

  private _clickHandler() {
    this._issues.fetch(this.title);
  }

  private _getTotalSpentTime(): string {
    const timeInSeconds = this._issues.value.reduce((totalTime, issue) => {
      return totalTime + issue.totalTimeSpent;
    }, 0);

    return formatIssueTime(timeInSeconds);
  }

  private _getTotalEstimatedTime(): string {
    const timeInSeconds = this._issues.value.reduce((totalTime, issue) => {
      return totalTime + issue.timeEstimate;
    }, 0);

    return formatIssueTime(timeInSeconds);
  }

  @property()
  title: string;

  render() {
    const issuesList = this._issues.isFetching
      ? html`<loader-lit></loader-lit>`
      : html`<issues-list .issues=${this._issues.value}></issues-list>`;

    return html`
      <div id="title">
        <h2>${this.title}</h2>
        <button
          @click=${this._clickHandler}
          ?disabled=${this._issues.isFetching}
        >
          Запросить задачи
        </button>
      </div>
      ${issuesList}
      <div class="totalTime">
        <div>Всего потрачено: ${this._getTotalSpentTime()}</div>
        <div>Всего оценено: ${this._getTotalEstimatedTime()}</div>
      </div>
    `;
  }
}
