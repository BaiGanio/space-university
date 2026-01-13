const routes = {};

export function register(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  window.location.hash = path;
}

window.addEventListener("hashchange", () => {
  const path = location.hash.slice(1);
  routes[path]?.();
});
