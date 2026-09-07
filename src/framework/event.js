export class EventManager {
  constructor(rootElement = document.body) {
    this.root = rootElement;
    this.eventRegistry = new Map();
  }

  registerEvents(vnode) {
    if (!vnode || typeof vnode !== 'object') return;

    const opid = vnode.opid || (vnode.props && vnode.props['data-opid']);
    const props = vnode.props || vnode.attrs || {};

    if (opid) {
      for (const key in props) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.startsWith('on')) {
          const eventType = lowerKey.slice(2);
          const registryKey = `${opid}:${eventType}`;
          this.eventRegistry.set(registryKey, props[key]);
        }
      }
    }

    if (Array.isArray(vnode.children)) {
      for (const child of vnode.children) {
        this.registerEvents(child);
      }
    }
  }

  init(eventTypes = ['click', 'input', 'change', 'submit']) {
    for (const type of eventTypes) {
      this.root.addEventListener(type, (event) => {
        const target = event.target.closest('[data-opid]');
        if (!target) return; 

        const opid = target.getAttribute('data-opid');
        const registryKey = `${opid}:${event.type}`;
        const handler = this.eventRegistry.get(registryKey);

        if (handler) {
          if (typeof handler === 'function') {
            handler(event);
          } else if (typeof handler === 'string') {
            console.log(`Triggering action: ${handler}`);
          }
        }
      });
    }
  }
}