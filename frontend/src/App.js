import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Differences from './pages/Differences';
import Root from './routes/Root';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "differences",
        element: <Differences />
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
