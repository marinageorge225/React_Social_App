import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import AuthLayout from "./Layouts/AuthLayout/AuthLayout";
import NewsFeed from "./pages/NewsFeed/NewsFeed";
import UserPosts from "./pages/UserPosts/UserPosts";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import AppProtectedRoutes from "./components/ProtectedRoutes/AppProtectedRoutes";
import AuthProtectedRoutes from "./components/ProtectedRoutes/AuthProtectedRoutes";
import PostDetails from "./pages/PostDetails/PostDetails";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <AppProtectedRoutes>
              <NewsFeed />
            </AppProtectedRoutes>
          ),
        },
        {
          path: "profile",
          element: (
            <AppProtectedRoutes>
              <UserPosts />{" "}
            </AppProtectedRoutes>
          ),
        },
        {
          path: "post/:id",
          element: (
            <AppProtectedRoutes>
              <PostDetails />{" "}
            </AppProtectedRoutes>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: (
            <AuthProtectedRoutes>
              <Login />{" "}
            </AuthProtectedRoutes>
          ),
        },
        {
          path: "register",
          element: (
            <AuthProtectedRoutes>
              <Register />
            </AuthProtectedRoutes>
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
