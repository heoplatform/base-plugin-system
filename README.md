# Base Plugin Manager

A lightweight and flexible plugin manager for JavaScript/TypeScript applications that provides a structured lifecycle for plugin initialization.

## Features

- **Two-phase initialization**: Supports both `init` and `postInit` hooks for proper dependency management
- **Async support**: Fully supports both synchronous and asynchronous plugin initialization
- **Type-safe**: Written in TypeScript with proper type definitions
- **Minimal footprint**: Lightweight with no external dependencies
- **Flexible**: Works with any plugin architecture

## Installation

```bash
npm install base-plugin-manager
```

## API

### BaseHooks Interface

```typescript
interface BaseHooks {
  init?: (plugins: any[]) => Promise<void> | void;
  postInit?: () => Promise<void> | void;
}
```

- **`init`**: Called during the first phase of initialization. Receives the full plugins array, allowing plugins to access and configure other plugins.
- **`postInit`**: Called during the second phase after all `init` hooks have completed. Useful for final setup steps that depend on other plugins being initialized.

### initPlugins Function

```typescript
async function initPlugins(plugins: any[]): Promise<void>
```

Initializes all plugins in a two-phase process:
1. **Phase 1**: Calls `init` on all plugins (if present)
2. **Phase 2**: Calls `postInit` on all plugins (if present)

## Usage

### Basic Example

```typescript
import { initPlugins, type BaseHooks } from 'base-plugin-manager';

// Define your plugins
const authPlugin: () => BaseHooks = () => {
  init: async (plugins) => {
    console.log('Initializing auth plugin...');
    // Setup authentication system
  },
  postInit: async () => {
    console.log('Auth plugin post-initialization');
    // Final auth setup after all plugins are initialized
  }
};

const databasePlugin: () => BaseHooks = () => {
  init: async (plugins) => {
    console.log('Initializing database plugin...');
    // Connect to database
  },
  postInit: async () => {
    console.log('Database plugin post-initialization');
    // Run migrations, cleanup, etc.
  }
};

const apiPlugin: () => BaseHooks = () => {
  init: async (plugins) => {
    console.log('Initializing API plugin...');

    // Loading a runtime dependency if it isn't already
    if (!plugins.some(p=>p.name === 'auth')) {
      const auth = authPlugin()
      plugins.push(auth)
      auth?.init(plugins)
    }
    // Access other plugins if needed
    // const auth = plugins.find(p => p.name === 'auth');
  }
};

// Initialize all plugins
const plugins = [authPlugin(), databasePlugin(), apiPlugin()];
await initPlugins(plugins);
```

## Initialization Phases

### Phase 1: `init`
- All `init` methods are called sequentially
- Each plugin receives the complete plugins array
- Setup only; no side-effects allowed
- Ideal for:
  - Setting up core functionality
  - Establishing dependencies

### Phase 2: `postInit`
- Called after all `init` methods have completed
- No parameters passed (plugins should have stored necessary references during `init`)
- Side-effects allowed
- Ideal for:
  - Final setup steps
  - Starting services
  - Operations that require all plugins to be initialized

## Best Practices

When writing plugins with their own lifecycle, start it during postInit. Here's an example:

Base plugin system
├── `init` on the express plugin
└── `postInit` on the express plugin
    ├── `initExpress` on the vite plugin
    └── `postInitExpress` on the vite plugin
        ├── `initVite` on the solid example plugin
        └── `postInitVite` on the solid example plugin

1. **Use `init` for setup**: Core plugin initialization and dependency resolution
2. **Use `postInit` for finalization**: Operations that require all plugins to be ready
3. **Store dependencies**: Save references to other plugins during the `init` phase
4. **Handle errors gracefully**: Use try-catch blocks in your plugin methods