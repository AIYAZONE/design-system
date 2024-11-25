import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * 示例组件
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("jds-info")
export class JDSInfo extends LitElement {
  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 1px #fd5000);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h2) {
      font-size: 1.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }

    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #fd5000;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto #fd5000;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #fd5000;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;

  @property()
  docsHint = "Tips: 点击Logo了解更多";

  @property({ type: Number })
  count = 0;

  render() {
    return html`
      <div>
        <a href="https://demo-docs.jackery.com" target="_blank">
          <img
            src="../assets/jds-logo.svg"
            class="logo"
            alt="Jackery Design System Logo"
          />
        </a>
      </div>
      <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">
          count is ${this.count}
        </button>
      </div>
      <p class="read-the-docs">${this.docsHint}</p>
    `;
  }

  private _onClick() {
    this.count++;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jds-info": JDSInfo;
  }
}
