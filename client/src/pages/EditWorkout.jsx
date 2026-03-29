import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWorkoutById, updateWorkout } from "../services/workoutService";

const EditWorkout = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    notes: "",
    exercises: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await getWorkoutById(id, token);

        setFormData({
          title: data.title || "",
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
          notes: data.notes || "",
          exercises:
            data.exercises?.map((exercise) => ({
              exerciseName: exercise.exerciseName || "",
              category: exercise.category || "",
              sets:
                exercise.sets?.map((set) => ({
                  reps: String(set.reps ?? ""),
                  weight: String(set.weight ?? ""),
                })) || [],
            })) || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load workout");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWorkout();
  }, [id, token]);

  const handleBasicChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExerciseChange = (exerciseIndex, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[exerciseIndex][field] = value;

    setFormData((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }));
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;

    setFormData((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }));
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseName: "",
          category: "",
          sets: [{ reps: "", weight: "" }],
        },
      ],
    }));
  };

  const removeExercise = (exerciseIndex) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex),
    }));
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[exerciseIndex].sets.push({ reps: "", weight: "" });

    setFormData((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }));
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.filter(
      (_, index) => index !== setIndex
    );

    setFormData((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedWorkout = {
      title: formData.title.trim(),
      date: formData.date || undefined,
      notes: formData.notes.trim(),
      exercises: formData.exercises.map((exercise) => ({
        exerciseName: exercise.exerciseName.trim(),
        category: exercise.category.trim(),
        sets: exercise.sets.map((set) => ({
          reps: Number(set.reps),
          weight: Number(set.weight),
        })),
      })),
    };

    if (!cleanedWorkout.title) {
      setError("Workout title is required");
      return;
    }

    if (cleanedWorkout.exercises.length === 0) {
      setError("At least one exercise is required");
      return;
    }

    for (const exercise of cleanedWorkout.exercises) {
      if (!exercise.exerciseName) {
        setError("Each exercise must have a name");
        return;
      }

      if (exercise.sets.length === 0) {
        setError("Each exercise must have at least one set");
        return;
      }

      for (const set of exercise.sets) {
        if (Number.isNaN(set.reps) || Number.isNaN(set.weight)) {
          setError("Each set must have valid reps and weight");
          return;
        }
      }
    }

    try {
      await updateWorkout(id, cleanedWorkout, token);
      navigate(`/workouts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update workout");
    }
  };

  if (loading) return <p>Loading workout...</p>;

  return (
    <div>
      <h1 className="page-title">Edit Workout</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Workout Title</label>
          <input
            type="text"
            name="title"
            placeholder="Workout Title"
            value={formData.title}
            onChange={handleBasicChange}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleBasicChange}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleBasicChange}
          />
        </div>

        {formData.exercises.map((exercise, exerciseIndex) => (
          <div className="exercise-block" key={exerciseIndex}>
            <h3>Exercise {exerciseIndex + 1}</h3>

            <div className="form-group">
              <label>Exercise Name</label>
              <input
                type="text"
                placeholder="Exercise Name"
                value={exercise.exerciseName}
                onChange={(e) =>
                  handleExerciseChange(
                    exerciseIndex,
                    "exerciseName",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                placeholder="Category"
                value={exercise.category}
                onChange={(e) =>
                  handleExerciseChange(exerciseIndex, "category", e.target.value)
                }
              />
            </div>

            {exercise.sets.map((set, setIndex) => (
              <div className="form-group" key={setIndex}>
                <label>Set {setIndex + 1}</label>

                <div className="inline-fields">
                  <input
                    type="number"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) =>
                      handleSetChange(
                        exerciseIndex,
                        setIndex,
                        "reps",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Weight"
                    value={set.weight}
                    onChange={(e) =>
                      handleSetChange(
                        exerciseIndex,
                        setIndex,
                        "weight",
                        e.target.value
                      )
                    }
                  />
                </div>

                <button
                  className="button button-danger"
                  type="button"
                  onClick={() => removeSet(exerciseIndex, setIndex)}
                >
                  Remove Set
                </button>
              </div>
            ))}

            <button
              className="button button-secondary"
              type="button"
              onClick={() => addSet(exerciseIndex)}
            >
              Add Set
            </button>

            <button
              className="button button-danger"
              type="button"
              onClick={() => removeExercise(exerciseIndex)}
            >
              Remove Exercise
            </button>
          </div>
        ))}

        <button className="button button-secondary" type="button" onClick={addExercise}>
          Add Exercise
        </button>

        <button className="button" type="submit">
          Update Workout
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default EditWorkout;