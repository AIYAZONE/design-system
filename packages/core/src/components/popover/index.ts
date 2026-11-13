import { html, LitElement, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, property, query, state } from '../../decorators';
import { autoUpdate, computePosition, flip, offset, shift, arrow as flArrow, Placement } from '@floating-ui/dom';

import styles from './index.less?inline';
import { adoptInternalStyles } from '../../styles/internal-shared';

/**
 * AIYAZONE 气泡卡片组件
 * 点击 / 悬停触发浮层，支持自定义触发元素、箭头与定位方向
 *
 * @cssproperty [--zone-index-popover=100] - 浮层层级
 */
@customElement('zone-popover')
export class ZonePopover extends LitElement {
  static styles = [unsafeCSS(styles)] as CSSResultGroup;

  protected firstUpdated(): void {
    if (this.shadowRoot) adoptInternalStyles(this.shadowRoot);
  }

  @property({ type: String })
  placement: Placement = 'bottom';

  @property({ type: Boolean })
  fitSize = false;

  @property({ type: Number })
  offset = 8;

  @property({ type: Number, attribute: 'arrow-padding' })
  arrowPadding = 8;

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
  private readonly _viewportPadding = 8;

  connectedCallback() {
    super.connectedCallback?.();
    this._setupTarget();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
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
      flip({ padding: this._viewportPadding }),
      shift({ crossAxis: true, padding: this._viewportPadding }),
    ];

    if (this._arrowEl) {
      middleware.push(flArrow({ element: this._arrowEl, padding: this.arrowPadding }));
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

    this.dispatchEvent(new CustomEvent('zone-popover-show'));

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

    this.dispatchEvent(new CustomEvent('zone-popover-hide'));
    this._cleanup?.();
  }

  setPopover() {
    if (!this._targetEl || !this._popoverEl) return;

    this._cleanup = autoUpdate(this._targetEl, this._popoverEl, () => {
      if (!this._targetEl || !this._popoverEl) return;

      computePosition(this._targetEl, this._popoverEl, {
        placement: this.placement,
        middleware: this.getMiddleware(),
        strategy: 'fixed',
      }).then(({ x, y, placement, middlewareData }) => {
        if (!this._popoverEl) return;

        Object.assign(this._popoverEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        this._popoverEl.setAttribute('data-placement', placement);

        if (this._arrowEl && middlewareData?.arrow) {
          const { x: ax, y: ay } = middlewareData.arrow as { x?: number; y?: number };
          Object.assign(this._arrowEl.style, {
            left: ax != null ? `${ax}px` : '',
            top: ay != null ? `${ay}px` : '',
          });
        }
      });
    });
  }

  render() {
    return html`
      <div class="popover ${this._visible ? 'visible' : ''}">
        <slot></slot>
        <div class="arrow" part="arrow"></div>
      </div>
    `;
  }
}

export type { Placement };

declare global {
  interface HTMLElementTagNameMap {
    'zone-popover': ZonePopover;
  }
}
