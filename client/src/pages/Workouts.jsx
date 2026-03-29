import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWorkouts, deleteWorkout } from "../services/workoutService";

const Workouts = () => {
  const { token } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts(token);
      setWorkouts(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWorkouts();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteWorkout(id, token);
      setWorkouts((prev) => prev.filter((workout) => workout._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete workout");
    }
  };

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div>
      <h1 className="page-title">Workouts</h1>

      <Link to="/workouts/new" className="button-link">
        Create New Workout
      </Link>

      {error && <p className="error">{error}</p>}

      {workouts.length === 0 ? (
        <p className="muted spacer-top">No workouts yet.</p>
      ) : (
        <div className="list section">
          {workouts.map((workout) => (
            <div className="card" key={workout._id}>
              <h3>{workout.title}</h3>
              <p className="muted">
                {new Date(workout.date).toLocaleDateString()}
              </p>
              <p>{workout.notes || "No notes"}</p>

              <div className="spacer-top">
                <Link to={`/workouts/${workout._id}`} className="button-link">
                  View
                </Link>
                <Link
                  to={`/workouts/${workout._id}/edit`}
                  className="button-link"
                >
                  Edit
                </Link>
                <button
                  className="button button-danger"
                  onClick={() => handleDelete(workout._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;