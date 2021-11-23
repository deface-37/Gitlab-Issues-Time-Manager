import {
  ReactiveController,
  ReactiveControllerHost,
} from '@lit/reactive-element';
import { GetIssues as query}  from '../api/issue.query.graphql';
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hostConnected() {}

  isFetching = false;
  value: ApiIssue[] = [];

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
  }

  fetch(milestone: string): void {
    this.host.requestUpdate();
    this.isFetching = true;
    this._fetchIssues(milestone).then(() => {
      this.host.requestUpdate();
      this.isFetching = false;
    });
  }
}
