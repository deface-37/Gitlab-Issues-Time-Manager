import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './Issue';

import { IssueFieldsFragment } from './issueFields.fragment';

@customElement('issues-list')
class IssuesList extends LitElement {
  static styles = css`
    :host {
      display: block;
      overflow-y: auto;
    }

    issue-lit {
      margin-bottom: 10px;
    }
  `;

  @property({ attribute: false })
  issues: IssueFieldsFragment[] = [];

  render() {
    return this.issues.map((issue) => {
      return html`<issue-lit
        title=${issue.title}
        spent=${issue.totalTimeSpent}
        estimated=${issue.timeEstimate}
        id=${issue.id}
        iid=${issue.iid}
        url=${issue.webUrl}
        ?closed=${issue.closedAt}
      ></issue-lit> `;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'issues-list': IssuesList;
  }
}
