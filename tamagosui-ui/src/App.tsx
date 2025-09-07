import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Providers from "./providers";
import HomePage from "./pages/home";
import { Toaster } from "./components/ui/sonner";
import PvpLobbyPage from "./pages/pvp/PvpLobbyPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/pvp/:challengeId",
    element: <PvpLobbyPage />,
  },
]);

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster />
    </Providers>
  );
}

export default App;