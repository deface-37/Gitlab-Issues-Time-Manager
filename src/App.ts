import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import './components/Milestone/MilestoneLit.ts'
import './components/Issue/IssueLit.ts'

@customElement('app-lit')
export default class AppLit extends LitElement{
  static styles = css`
  :host {
    display: block;
  }
  `

  render() {
    return html`
      <milestone-lit title="Название вехи">
        <issue-lit slot="issue" title="Задача 1" estimated="55" spend="33"></issue-lit>
        <issue-lit slot="issue" title="Задача 1" estimated="10" spend="22"></issue-lit>
      </milestone-lit>
    `
  }
}