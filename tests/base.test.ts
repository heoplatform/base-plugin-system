import { describe, it, expect, beforeEach } from 'vitest';
import { initPlugins, BaseHooks } from '../src/index'; // Adjust path as necessary
import { createBaseTestingPlugin, BaseTestingPluginHooks } from './base.testing.plugin';

describe('Base Plugin System - initPlugins', () => {
  let testingPlugin: BaseHooks & BaseTestingPluginHooks;

  beforeEach(() => {
    testingPlugin = createBaseTestingPlugin();
  });

  it('should call init and postInit on a single plugin', async () => {
    await initPlugins([testingPlugin]);
    expect(testingPlugin.initCalled).toBe(true);
    expect(testingPlugin.postInitCalled).toBe(true);
  });

  it('should call init before postInit', async () => {
    let initTimestamp: number | undefined;
    let postInitTimestamp: number | undefined;

    const orderTestPlugin: BaseHooks = {
      async init() {
        initTimestamp = Date.now();
        // Introduce a small delay to ensure timestamps are different if order is correct
        await new Promise(resolve => setTimeout(resolve, 1)); 
      },
      async postInit() {
        postInitTimestamp = Date.now();
      },
    };

    await initPlugins([orderTestPlugin]);

    expect(initTimestamp).toBeDefined();
    expect(postInitTimestamp).toBeDefined();
    expect(initTimestamp!).toBeLessThan(postInitTimestamp!);
  });

  it('should pass all other plugins to the init method', async () => {
    const mockPlugin1: BaseHooks = {}; // Simple mock plugin, no non-standard properties
    const mockPlugin2: BaseHooks = {};
    await initPlugins([testingPlugin, mockPlugin1, mockPlugin2]);

    expect(testingPlugin.initCalled).toBe(true);
    expect(testingPlugin.pluginsReceived).toBeDefined();
    expect(testingPlugin.pluginsReceived).toHaveLength(3);
    // Check if the received plugins are the ones we passed (by reference or structure)
    expect(testingPlugin.pluginsReceived).toContain(testingPlugin);
    expect(testingPlugin.pluginsReceived).toContain(mockPlugin1);
    expect(testingPlugin.pluginsReceived).toContain(mockPlugin2);
  });

  it('should handle plugins without init or postInit methods gracefully', async () => {
    const noHooksPlugin: BaseHooks = {}; // Simple mock plugin
    await expect(initPlugins([noHooksPlugin, testingPlugin])).resolves.not.toThrow();
    expect(testingPlugin.initCalled).toBe(true);
    expect(testingPlugin.postInitCalled).toBe(true);
  });

  it('should handle an empty array of plugins', async () => {
    await expect(initPlugins([])).resolves.not.toThrow();
  });

  it('should await async init methods', async () => {
    let initFinished = false;
    const asyncInitPlugin: BaseHooks = {
      async init() {
        await new Promise(resolve => setTimeout(resolve, 50));
        initFinished = true;
      },
    };
    await initPlugins([asyncInitPlugin]);
    expect(initFinished).toBe(true);
  });

  it('should await async postInit methods', async () => {
    let postInitFinished = false;
    const asyncPostInitPlugin: BaseHooks = {
      async postInit() {
        await new Promise(resolve => setTimeout(resolve, 50));
        postInitFinished = true;
      },
    };
    await initPlugins([asyncPostInitPlugin]);
    expect(postInitFinished).toBe(true);
  });

}); 