import { ReactiveController, ReactiveControllerHost } from "@lit/reactive-element";
import query from '../api/issue-query.graphql';
import apiInfo from '../api/api.json'

export type ApiIssue = {
  iid: string;
  id: string;
  title: string;
  totalTimeSpent: number;
  timeEstimate: number;
  webUrl: string;
  closedAd: string;
}

export class IssueController implements ReactiveController {
  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    host.addController(this)
    this.host = host;

  }

  hostConnected() { }

  async fetchIssues(milestone: string):Promise<ApiIssue[]> {
    const body = {
      query,
      variables: JSON.stringify({milestone})
    }

    const response = await fetch(apiInfo.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'PRIVATE-TOKEN': apiInfo.token
      },
      body: JSON.stringify(body)
    })

    const result = await response.json();

    return result.data.group.issues.nodes as ApiIssue[]
    
  }


}