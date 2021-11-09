import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('issue-lit')
export default class IssueLit extends LitElement {

  @property()
  title!: string;
  @property({type: Number})
  spend!: number;
  @property({type: Number})
  estimated!: number;

  static styles = css`
  :host {
    border: 3px solid black;
    display: block;
    padding: 5px;
    border-radius: 15px;
  }

  h3 {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  `

  render() {
    return html`
      <h3>${this.title}</h3>
      <div>Потрачено ${this.spend} часов</div>
      <div>Оценено ${this.estimated} часов</div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'issue-lit': IssueLit
  }
}