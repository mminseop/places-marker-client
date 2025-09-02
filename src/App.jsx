import "./App.scss";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/Mypage";
import UserSettings from "./components/UserSettings";
import UserPlaces from "./components/UserPlaces";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("places-token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mypage",
    element: (
      <ProtectedRoute>
        <MyPage />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // 기본: /mypage
        element: <UserSettings />,
      },
      {
        path: "places", // /mypage/favorites
        element: <UserPlaces />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
