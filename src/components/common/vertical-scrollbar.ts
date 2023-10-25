import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('vertical-scrollbar')
export class VerticalScrollbar extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    div {
      height: 100%;
      overflow-y: auto;
    }

    ::-webkit-scrollbar {
      width: 12px;
      -webkit-border-radius: 100px;
      border-radius: 100px;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      border: 3px solid transparent;
      background-clip: padding-box;
      background-color: #aaaaaa;
      -webkit-border-radius: 100px;
      border-radius: 100px;
    }

    /* div:hover::-webkit-scrollbar-thumb:vertical {
            background-color: rgba(0, 0, 0, 0.4);
        } */

    /* ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.55);
        }

        ::-webkit-scrollbar-thumb:vertical:active {
            background-color: rgba(0, 0, 0, 0.61);
        } */
  `;

  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vertical-scrollbar': VerticalScrollbar;
  }
}
