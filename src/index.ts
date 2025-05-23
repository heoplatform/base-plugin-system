export interface BaseHooks {
  init?: (plugins: any[]) => Promise<void> | void;
  postInit?: () => Promise<void> | void;
}

async function initPlugins(plugins: any[]) {
  for (const plugin of plugins) {
    if (plugin.init) {
      await plugin.init(plugins);
    }
  }
  for (const plugin of plugins) {
    if (plugin.postInit) {
      await plugin.postInit();
    }
  }
}

export { initPlugins };