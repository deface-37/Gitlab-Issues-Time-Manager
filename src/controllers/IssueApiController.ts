import {
  ReactiveController,
  ReactiveControllerHost,
} from '@lit/reactive-element';
import query from '../api/issue-query.graphql';
import api from '../api/api.json';

export type ApiIssue = {
  iid: string;
  id: string;
  title: string;
  totalTimeSpent: number;
  timeEstimate: number;
  webUrl: string;
  closedAd: string;
};

export class IssuesController implements ReactiveController {
  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    host.addController(this);
    this.host = host;
  }

  hostConnected() {}

  value: ApiIssue[] = [];
  fetching: Promise<void> = Promise.resolve();

  private async _fetchIssues(milestone: string): Promise<void> {
    const body = {
      query,
      variables: JSON.stringify({ milestone }),
    };

    const response = await fetch(api.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'PRIVATE-TOKEN': api.token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    this.value = data.data.group.issues.nodes;

    this.host.requestUpdate();
  }

  fetch(milestone: string): void {
    this.fetching = this._fetchIssues(milestone);
    this.host.requestUpdate();
  }
}
