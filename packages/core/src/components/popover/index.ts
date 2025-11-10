import { html, LitElement, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property, query, state } from '../../decorators';
import { autoUpdate, computePosition, flip, offset, Placement } from '@floating-ui/dom';

import styles from './index.less?inline';

@customElement('jds-popover')
export class JdsPopover extends LitElement {
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  @property({ type: String })
  placement: Placement = 'bottom';

  @property({ type: Boolean })
  fitSize = false;

  @property({ type: Number })
  offset = 8;

  @property({ type: String })
  target?: string;

  @state()
  private _visible = false;

  @query('.popover')
  private _popoverEl!: HTMLElement;

  @query('.arrow')
  private _arrowEl!: HTMLElement;

  private _targetEl?: HTMLElement;
  private _cleanup?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._setupTarget();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup?.();
  }

  private _setupTarget() {
    if (this.target) {
      this._targetEl = document.getElementById(this.target) || undefined;
    } else {
      this._targetEl = this.previousElementSibling as HTMLElement;
    }

    if (this._targetEl) {
      this._targetEl.addEventListener('click', this._togglePopover);
      this._targetEl.setAttribute('aria-haspopup', 'true');
      this._targetEl.setAttribute('aria-expanded', 'false');
    }
  }

  private _togglePopover = () => {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  };

  private getMiddleware() {
    const middleware = [
      offset(this.offset),
      flip()
    ];

    if (this._arrowEl) {
      middleware.push({
        name: 'arrow',
        options: {
          element: this._arrowEl,
        },
        fn: ({ middlewareData }) => {
          if (middlewareData.arrow) {
            const { x, y } = middlewareData.arrow;
            Object.assign(this._arrowEl.style, {
              left: x != null ? `${x}px` : '',
              top: y != null ? `${y}px` : '',
            });
          }
          return {};
        }
      });
    }

    return middleware;
  }

  private _handleClickOutside = (event: Event) => {
    if (!this._visible) return;

    const target = event.target as Element;
    if (!this._popoverEl.contains(target) && !this._targetEl?.contains(target)) {
      this.hide();
    }
  };

  private _handleKeydownEvent = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  show() {
    if (this._visible || !this._targetEl) return;

    this._visible = true;
    this._targetEl?.setAttribute('aria-expanded', 'true');

    document.addEventListener('click', this._handleClickOutside);
    document.addEventListener('keydown', this._handleKeydownEvent);

    this.dispatchEvent(new CustomEvent('jds-popover-show'));

    this.updateComplete.then(() => {
      this.setPopover();
    });
  }

  hide() {
    if (!this._visible) return;

    this._visible = false;
    this._targetEl?.setAttribute('aria-expanded', 'false');

    document.removeEventListener('click', this._handleClickOutside);
    document.removeEventListener('keydown', this._handleKeydownEvent);

    this.dispatchEvent(new CustomEvent('jds-popover-hide'));
    this._cleanup?.();
  }

  setPopover() {
    if (!this._targetEl || !this._popoverEl) return;

    this._cleanup = autoUpdate(this._targetEl, this._popoverEl, () => {
      if (!this._targetEl || !this._popoverEl) return;

      computePosition(this._targetEl, this._popoverEl, {
        placement: this.placement,
        middleware: this.getMiddleware(),
      }).then(({ x, y, placement }) => {
        if (!this._popoverEl) return;

        Object.assign(this._popoverEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        this._popoverEl.setAttribute('data-placement', placement);
      });
    });
  }

  render() {
    return html`
      <div class="popover ${this._visible ? 'visible' : ''}">
        <slot></slot>
        <div class="arrow"></div>
      </div>
    `;
  }
}

export type { Placement };

declare global {
  interface HTMLElementTagNameMap {
    'jds-popover': JdsPopover;
  }
}
