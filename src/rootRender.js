import ReactDOM from 'react-dom/client';

export function mountApp(rootElement, app) {
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, app);
  } else {
    ReactDOM.createRoot(rootElement).render(app);
  }
}
