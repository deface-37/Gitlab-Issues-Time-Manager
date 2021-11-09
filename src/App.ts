import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import './components/Milestone/MilestoneLit.ts'
import './components/Issue/IssueLit.ts'

@customElement('app-lit')
export default class AppLit extends LitElement {
  static styles = css`
  :host {
    display: block;
  }
  `

  render() {
    return html`
      <milestone-lit title="Спринт 85">
        
      </milestone-lit>
    `
  }
}