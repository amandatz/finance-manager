import "@testing-library/jest-dom/vitest";

// Node 22+ ships an experimental native `localStorage` global (gated behind
// `--localstorage-file`, which we don't set). That accessor shadows jsdom's
// own Storage implementation on the shared global object, so
// `window.localStorage.setItem` silently exists-but-no-ops (or is entirely
// missing, depending on version) inside the test environment. Replace it
// with a small in-memory Storage polyfill so code under test (and tests
// themselves) can rely on a real, working localStorage.
if (typeof window !== "undefined") {
  class MemoryStorage implements Storage {
    private store = new Map<string, string>();

    get length() {
      return this.store.size;
    }

    key(index: number) {
      return Array.from(this.store.keys())[index] ?? null;
    }

    getItem(key: string) {
      return this.store.has(key) ? this.store.get(key)! : null;
    }

    setItem(key: string, value: string) {
      this.store.set(key, String(value));
    }

    removeItem(key: string) {
      this.store.delete(key);
    }

    clear() {
      this.store.clear();
    }
  }

  Object.defineProperty(window, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
    writable: true,
  });
}

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
