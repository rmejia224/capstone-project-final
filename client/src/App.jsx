import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import NewWorkout from "./pages/NewWorkout";
import WorkoutDetails from "./pages/WorkoutDetails";
import EditWorkout from "./pages/EditWorkout";
import Records from "./pages/Records";
import Progress from "./pages/Progress";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("barpath-theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("barpath-theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("barpath-theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            BarPath
          </Link>

          <nav className="nav-links">
            <Link to="/">{user ? "Overview" : "Home"}</Link>

            {user ? (
              <>
                <Link to="/workouts">Workouts</Link>
                <Link to="/records">Records</Link>
                <Link to="/progress">Progress</Link>

                <button
                  className="button button-secondary"
                  type="button"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>

                <button
                  className="button button-secondary"
                  type="button"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>

                <button
                  className="button button-secondary"
                  type="button"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workouts/new"
            element={
              <ProtectedRoute>
                <NewWorkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workouts/:id"
            element={
              <ProtectedRoute>
                <WorkoutDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workouts/:id/edit"
            element={
              <ProtectedRoute>
                <EditWorkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <Records />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;