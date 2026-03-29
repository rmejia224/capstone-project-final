import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getExerciseProgress } from "../services/progressService";
import { getWorkouts } from "../services/workoutService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Progress = () => {
  const { token } = useAuth();

  const [exercise, setExercise] = useState("");
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [data, setData] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExerciseOptions = async () => {
      try {
        const workouts = await getWorkouts(token);

        const uniqueExercises = [
          ...new Set(
            workouts.flatMap((workout) =>
              workout.exercises.map((exercise) => exercise.exerciseName)
            )
          ),
        ].filter(Boolean);

        setExerciseOptions(uniqueExercises);

        if (uniqueExercises.length > 0) {
          setExercise(uniqueExercises[0]);
        }

        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load exercises");
      } finally {
        setLoadingOptions(false);
      }
    };

    if (token) {
      fetchExerciseOptions();
    }
  }, [token]);

  const handleFetch = async () => {
    if (!exercise) return;

    try {
      setLoadingChart(true);

      const res = await getExerciseProgress(exercise, token);

      const formatted = res.map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        weight: item.weight,
        oneRM: item.estimatedOneRepMax,
      }));

      setData(formatted);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load progress");
      setData([]);
    } finally {
      setLoadingChart(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Progress Tracker</h1>

      <div className="form">
        <div className="form-group">
          <label>Select Exercise</label>

          {loadingOptions ? (
            <p className="muted">Loading exercises...</p>
          ) : exerciseOptions.length === 0 ? (
            <p className="muted">
              No exercises found yet. Add workouts first to track progress.
            </p>
          ) : (
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              {exerciseOptions.map((exerciseName) => (
                <option key={exerciseName} value={exerciseName}>
                  {exerciseName}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          className="button"
          onClick={handleFetch}
          disabled={!exercise || loadingOptions || exerciseOptions.length === 0}
        >
          {loadingChart ? "Loading..." : "Load Progress"}
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      {data.length > 0 ? (
        <div className="card section">
          <h2>{exercise} Progress</h2>
          <div style={{ width: "100%", height: 320, marginTop: "16px" }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" name="Weight" />
                <Line type="monotone" dataKey="oneRM" name="Estimated 1RM" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="muted section">
          Select an exercise and load progress to view your chart.
        </p>
      )}
    </div>
  );
};

export default Progress;