import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { IssuesController } from '../../controllers/IssueApiController';
import './IssuesList';

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
  `;
  private _issues = new IssuesController(this);

  _clickHandler() {
    this._issues.fetch(this.title);
  }

  @property()
  title: string;

  render() {
    const issuesList = this._issues.fetching.then(
      () => html`<issues-list .issues=${this._issues.value}></issues-list>`
    );

    return html`
      <div id="title">
        <h2>${this.title}</h2>
        <button @click=${this._clickHandler}>Запросить задачи</button>
      </div>
      ${until(issuesList, html`<p>Loading ...</p>`)}
    `;
  }
}
