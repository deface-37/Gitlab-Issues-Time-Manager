import templateHtml from './MilestoneTemplate.html';
import IssueElement from '../issue/Issue.js';

const template = document.createElement('template')
template.innerHTML = templateHtml;

export default class MilestoneElement extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({mode: 'open'})
    shadow.append(template.content.cloneNode(true))
  }

  /**
   * 
   * @param {object} issueInfo параметры задачи
   * @param {string} issueInfo.title - заголовок задачи
   * @param {string|number} issueInfo.spend - потраченное время
   * @param {string|number} issueInfo.estimated - оцененное время
   */
  createIssue(issueInfo) {
    const issue = new IssueElement(issueInfo);
    issue.slot = 'issue'

    this.append(issue);
  }
}

customElements.define('milestone-element', MilestoneElement)