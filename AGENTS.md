# AGENTS.md

This file provides guidelines for agentic coding agents working in this repository.

## Project Overview

**@zanejs/ui** - A modern, lightweight native Web Components UI library built with [Stencil.js](https://stenciljs.com/). Framework-agnostic, works in JS/Vue/React/Angular projects with complete TypeScript type support.

## Build / Lint / Test Commands

```bash
# Development
pnpm run dev              # Start dev server with hot reload
pnpm run start:watch      # Stencil build --dev --watch --serve --cors

# Build
pnpm run build            # Production build (pnpm run build:stencil)
pnpm run build:stencil    # Stencil build --docs --prod
pnpm run build:docs-only  # Generate documentation only
pnpm run generate         # Generate new components
pnpm run clean            # Clean dist and build artifacts

# Testing
pnpm run test             # Run all tests (spec + e2e)
pnpm run test.watch       # Run tests in watch mode

# No dedicated lint command - use editor ESLint integration
```

## Code Style Guidelines

### General Conventions

- **Tab size**: 2 spaces (configured in `.vscode/settings.json`)
- **Line endings**: LF (`\n`)
- **Final newline**: Always present
- **Prettier**: Default formatter for most file types
- **Editor config**: See `.vscode/settings.json` for full editor settings

### Component Structure

Each component should have the following files in `src/components/<component-name>/`:
- `zane-<name>.tsx` - Component implementation
- `zane-<name>.scss` - Component styles
- `readme.md` - Component documentation

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ZaneButton`, `ZaneInput` |
| HTML tags | kebab-case | `zane-button`, `zane-input` |
| Files | kebab-case | `zane-button.tsx`, `zane-button.scss` |
| CSS classes | BEM-like with namespace | `zane-button--primary`, `zane-button__icon` |
| Props | camelCase | `buttonType`, `autoInsertSpace` |
| Events | kebab-case in HTML, camelCase in TS | `zClick` (emitted), `z-click` (listened) |
| State | prefix with `_` for internal | `_disabled`, `_type` |

### Import Order

1. Type imports (`import type {...}`)
2. External package imports (e.g., `@stencil/core`, `@ctrl/tinycolor`)
3. Relative imports (constants, utils, hooks, global)

```typescript
import type { ButtonGroupContext } from '../../interfaces';
import type { ButtonNativeType, ButtonType, ComponentSize } from '../../types';

import { TinyColor } from '@ctrl/tinycolor';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { buttonGroupContexts } from '../../constants';
import state from '../../global/store';
import { useNamespace } from '../../hooks';
import { darken, findAllLegitChildren } from '../../utils';
```

### Stencil Component Patterns

Use decorators: `@Component()`, `@Prop()`, `@State()`, `@Event()`, `@Element()`, `@Watch()`, `@Listen()`

```typescript
@Component({
  styleUrl: 'zane-button.scss',
  tag: 'zane-button',
})
export class ZaneButton {
  @Prop() disabled: boolean = false;
  @State() _disabled: boolean;
  @Event({ eventName: 'zClick' }) clickEvent: EventEmitter<MouseEvent>;
  @Element() el: HTMLElement;

  @Watch('disabled')
  onPropChange() {
    this.updateInternalState();
  }

  render() {
    return (
      <Host>
        <button disabled={this.disabled}>
          <slot />
        </button>
      </Host>
    );
  }
}
```

### TypeScript Rules

Configured in `tsconfig.json`:
- `noUnusedLocals: true` - Remove unused local variables
- `noUnusedParameters: true` - Remove unused function parameters
- `allowUnreachableCode: false` - No unreachable code
- `allowSyntheticDefaultImports: true`
- `experimentalDecorators: true` - Required for Stencil

### CSS / SCSS

- Use SCSS with BEM-like naming via `useNamespace` hook
- Namespace prefix: component name (e.g., `zane-button`)
- Use `ns.b()` for block, `ns.m()` for modifier, `ns.e()` for element, `ns.is()` for state
- Global theme variables in `src/global/theme/`

```typescript
const ns = useNamespace('button');
// ns.b()   -> 'zane-button'
// ns.m('primary')   -> 'zane-button--primary'
// ns.e('icon')   -> 'zane-button__icon'
// ns.is('loading')   -> 'is-loading'
```

### Error Handling

- Use `console.error` for errors in development
- Use Stencil's `@Watch()` decorators to react to prop changes
- Validate props in `componentWillLoad()` or watchers
- Use TypeScript types for compile-time safety

### Internationalization

- Use `zane-config-provider` for locale configuration
- Locale values: `zh-cn` or `en`
- Language packs in `src/locale/`

### Common External Dependencies

- `@stencil/core` - Web Components compiler
- `@ctrl/tinycolor` - Color manipulation
- `@floating-ui/dom` - Floating element positioning
- `@popperjs/core` - Tooltip positioning
- `@stencil/store` - State management
- `sass` - SCSS compilation

### Global Configuration

- Global script: `src/global.ts`
- Global styles: `src/global/theme/index.scss`
- Global state: `src/global/store.ts`

### External Dependencies

The following packages are external and not bundled:
- `@zanejs/icons` - Icon components
- `@zanejs/utils` - Utility functions
