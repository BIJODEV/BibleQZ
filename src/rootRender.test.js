import { mountApp } from './rootRender';
import ReactDOM from 'react-dom/client';

jest.mock('react-dom/client', () => ({
  hydrateRoot: jest.fn(),
  createRoot: jest.fn(() => ({ render: jest.fn() })),
}));

// react-scripts' default Jest config sets resetMocks: true, which wipes the
// mock implementation supplied to jest.fn() above between tests. Restore it
// before each test so createRoot() keeps returning a valid root object.
beforeEach(() => {
  ReactDOM.createRoot.mockImplementation(() => ({ render: jest.fn() }));
});

test('hydrates when the root element already has prerendered content', () => {
  const root = document.createElement('div');
  root.innerHTML = '<p>prerendered</p>';
  const app = <div>app</div>;

  mountApp(root, app);

  expect(ReactDOM.hydrateRoot).toHaveBeenCalledWith(root, app);
  expect(ReactDOM.createRoot).not.toHaveBeenCalled();
});

test('creates a fresh root when the root element is empty', () => {
  const root = document.createElement('div');
  const app = <div>app</div>;

  mountApp(root, app);

  expect(ReactDOM.createRoot).toHaveBeenCalledWith(root);
});
