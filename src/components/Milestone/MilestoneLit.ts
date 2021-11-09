import { LitElement, html, css, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { IssueController, ApiIssue } from '../../controllers/IssueApiController'
import { until } from 'lit/directives/until.js';

@customElement('milestone-lit')
export default class MilestoneLit extends LitElement {
  static styles = css`
  :host {
    display: block;
    width: 300px;
    border: 1px solid black;
    height: 90vh;
    box-sizing: border-box;
    margin: 5vh auto;
    padding: 10px;
    border-radius: 5px;
    overflow-y: auto;
  }

  h2 {
    margin: 0;
  }

  #title {
    border-bottom: 2px solid black;
    margin-bottom: 15px;
  }

  ::slotted(issue-lit) {
    margin-bottom: 10px;
  }
  `

  issueController = new IssueController(this);

  @state()
  private _issues: ApiIssue[] = [];

  private _secondsToHours(seconds: number) {
    return Math.round((seconds / 3600) * 100) / 100
  }

  async getIssues() {
    // Получаем задачи
    this._issues = await this.issueController.fetchIssues(this.title)
  }

  @property()
  title: string;

  render() {
    // Рендерим задачи
    const renderedIssues = this._issues.map((issue: ApiIssue) => {
      const spendHours = this._secondsToHours(issue.totalTimeSpent)
      const estimateHours = this._secondsToHours(issue.timeEstimate)

      return html`<issue-lit spend=${spendHours} 
        estimated=${estimateHours}
        title=${issue.title}></issue-lit>`
    })

    return html`
    <div id="title">
      <h2>${this.title}</h2>
      <button @click=${this.getIssues}>Запросить задачи</button>
    </div>
    <div id="issues">
      ${until(renderedIssues, html`<p>Loading ...</p>`)}
    </div>
    `
  }
}