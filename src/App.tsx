import { FC, ReactNode } from "react";
import { useAuthStore } from "./store/authStore.ts";
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router";
import HomePage from "@/screens/HomePage.tsx";
import ContractsPage from "@/screens/ContractsPage.tsx";
import AuthPage from "@/screens/AuthPage.tsx";

const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isLoadingAuth = useAuthStore((state) => state.isLoadingAuth);

  if (isLoadingAuth) {
    return <div>...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div>
      <nav
        style={{
          padding: "20px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            gap: "20px",
          }}
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contracts">Contracts</Link>
          </li>
        </ul>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={logout}
              style={{
                padding: "8px 15px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#dc3545",
                color: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
            }}
          >
            Sing In
          </Link>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/contracts"
            element={
              <PrivateRoute>
                <ContractsPage />
              </PrivateRoute>
            }
          />
          {/*<Route path="*" element={<NotFoundPage />} />*/}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
