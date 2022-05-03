import { queryControllerWithClient } from './../../apollo/controllerWithClient';
import { GetProjectInfo } from './GetProjectPathInfo.query';
import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { formatIssueTime } from '../../helpers/format-helper';

import '@spectrum-web-components/link/sp-link.js';

@customElement('issue-lit')
export default class IssueLit extends LitElement {
  @property()
  title!: string;
  @property({ type: Number })
  spent!: number;
  @property({ type: Number })
  estimated!: number;
  @property()
  id!: string;
  @property()
  iid!: string;
  @property()
  url!: string;
  @property({ type: Boolean })
  closed = false;
  @property({ type: Number })
  projectIdNum!: number;
  @state()
  projectFullPath?: string;
  projectId?: string;

  private projectController = queryControllerWithClient(this, GetProjectInfo, {
    variables: { projectIds: this.projectId },
    onData: (data) => {
      this.projectFullPath = data.projects?.nodes?.[0].fullPath;
    },
  });

  static styles = css`
    :host {
      border: 2px solid black;
      display: block;
      padding: 5px;
      border-radius: 15px;
    }

    :host([closed]) {
      background-color: var(--spectrum-global-color-gray-300);
    }

    h3 {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  `;

  render() {
    return html`
      <h3>
        <sp-link target="_blank" href=${this.url} variant="secondary" quiet>
          #${this.iid} ${this.title} ${this.closed ? '(closed)' : ''}</sp-link
        >
      </h3>
      <div>Потрачено: ${formatIssueTime(this.spent)}</div>
      <div>Оценено: ${formatIssueTime(this.estimated)}</div>
    `;
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has('projectIdNum')) {
      this.projectId = `gid://gitlab/Project/${this.projectIdNum}`;
      this.projectController.executeQuery({
        variables: { projectIds: this.projectId },
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'issue-lit': IssueLit;
  }
}
