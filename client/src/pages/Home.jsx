import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProgressSummary } from "../services/progressService";

const Home = () => {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user || !token) return;

      try {
        setLoading(true);
        const data = await getProgressSummary(token);
        setSummary(data);
      } catch (error) {
        console.error("HOME SUMMARY ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user, token]);

  return (
    <div>
      <h1 className="page-title">
        {user ? `Welcome back, ${user.name}` : "Welcome to BarPath"}
      </h1>

      <p className="muted">
        Track workouts, monitor personal records, and visualize strength
        progress over time.
      </p>

      {user ? (
        <>
          <section className="section">
            <h2>Quick Actions</h2>
            <Link to="/workouts/new" className="button-link">
              New Workout
            </Link>
            <Link to="/workouts" className="button-link">
              Workouts
            </Link>
            <Link to="/records" className="button-link">
              Records
            </Link>
            <Link to="/progress" className="button-link">
              Progress
            </Link>
          </section>

          <section className="section">
            <h2>Overview</h2>

            {loading ? (
              <p className="muted">Loading stats...</p>
            ) : (
              <>
                <div className="grid grid-3 spacer-top">
                  <div className="card stat-card accent-blue">
                    <h3>Workouts This Week</h3>
                    <p className="stats-number">{summary?.weeklyWorkoutCount ?? 0}</p>
                  </div>

                  <div className="card stat-card accent-green">
                    <h3>Total Workouts</h3>
                    <p className="stats-number">{summary?.totalWorkouts ?? 0}</p>
                  </div>

                  <div className="card stat-card accent-orange">
                    <h3>Total Sets</h3>
                    <p className="stats-number">{summary?.totalSets ?? 0}</p>
                  </div>
                </div>

                <div className="grid grid-3 spacer-top">
                  <div className="card stat-card accent-purple">
                    <h3>Total Exercises Logged</h3>
                    <p className="stats-number">{summary?.totalExercises ?? 0}</p>
                  </div>

                  <div className="card stat-card accent-pink">
                    <h3>Most Recent Workout</h3>
                    {summary?.mostRecentWorkout ? (
                      <>
                        <p className="stats-number recent-title">
                          {summary.mostRecentWorkout.title}
                        </p>
                        <p className="muted">
                          {new Date(summary.mostRecentWorkout.date).toLocaleDateString()}
                        </p>
                        <Link
                          to={`/workouts/${summary.mostRecentWorkout._id}`}
                          className="button-link"
                        >
                          View Workout
                        </Link>
                      </>
                    ) : (
                      <p className="muted">No workouts yet</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </>
      ) : (
        <section className="section">
          <Link to="/register" className="button-link">
            Get Started
          </Link>
          <Link to="/login" className="button-link">
            Login
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;