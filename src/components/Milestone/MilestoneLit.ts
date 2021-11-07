import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

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
  
  @property()
  title: string;

  render() {
    return html`
    <div id="title">
      <h2>${this.title}</h2>
    </div>
    <div id="issues">
      <slot name="issue"></slot>
    </div>
    `
  }
}