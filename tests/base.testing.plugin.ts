import { BaseHooks } from '../src/index'; // Adjust path as necessary

export interface BaseTestingPluginHooks {
  initCalled: boolean;
  postInitCalled: boolean;
  pluginsReceived?: any[];
}

export function createBaseTestingPlugin(): BaseHooks & BaseTestingPluginHooks {
  const state: BaseTestingPluginHooks = {
    initCalled: false,
    postInitCalled: false,
  };

  return {
    // BaseTestingPluginHooks
    get initCalled() { return state.initCalled; },
    get postInitCalled() { return state.postInitCalled; },
    get pluginsReceived() { return state.pluginsReceived; },

    // BaseHooks
    async init(plugins: any[]) {
      state.initCalled = true;
      state.pluginsReceived = [...plugins]; // Store a copy
    },
    async postInit() {
      state.postInitCalled = true;
    },
  };
} 