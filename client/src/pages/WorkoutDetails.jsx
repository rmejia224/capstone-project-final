import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWorkoutById } from "../services/workoutService";

const WorkoutDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await getWorkoutById(id, token);
        setWorkout(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load workout");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWorkout();
  }, [id, token]);

  if (loading) return <p>Loading workout...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!workout) return <p className="muted">Workout not found.</p>;

  return (
    <div>
      <h1 className="page-title">{workout.title}</h1>

      <div className="card">
        <p>
          <strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Notes:</strong> {workout.notes || "No notes"}
        </p>
      </div>

      <section className="section">
        <h2>Exercises</h2>

        <div className="list spacer-top">
          {workout.exercises.map((exercise, index) => (
            <div className="card" key={index}>
              <h3>{exercise.exerciseName}</h3>
              <p className="muted">Category: {exercise.category || "N/A"}</p>

              <ul className="spacer-top">
                {exercise.sets.map((set, setIndex) => (
                  <li key={setIndex}>
                    {set.reps} reps × {set.weight} lbs
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="section">
        <Link to={`/workouts/${workout._id}/edit`} className="button-link">
          Edit Workout
        </Link>
        <Link to="/workouts" className="button-link">
          Back to Workouts
        </Link>
      </div>
    </div>
  );
};

export default WorkoutDetails;