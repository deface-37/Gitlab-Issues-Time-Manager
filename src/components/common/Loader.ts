import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('loader-lit')
export class Loader extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    return html`<p>Loading ...</p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'loader-lit': Loader;
  }
}
