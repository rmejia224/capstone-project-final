import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecords, recalculateRecords } from "../services/recordService";

const Records = () => {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getRecords(token);
      setRecords(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRecords();
  }, [token]);

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      const data = await recalculateRecords(token);
      setRecords(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to recalculate records");
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) return <p>Loading records...</p>;

  return (
    <div>
      <h1 className="page-title">Personal Records</h1>

      <button className="button" onClick={handleRecalculate} disabled={recalculating}>
        {recalculating ? "Recalculating..." : "Recalculate Records"}
      </button>

      {error && <p className="error">{error}</p>}

      {records.length === 0 ? (
        <p className="muted section">
          No records found yet. Create workouts, then recalculate records.
        </p>
      ) : (
        <div className="list section">
          {records.map((record) => (
            <div className="card" key={record._id}>
              <h3>{record.exerciseName}</h3>
              <p>Max Weight: {record.maxWeight} lbs</p>
              <p>Reps: {record.reps}</p>
              <p>Estimated 1RM: {record.estimatedOneRepMax} lbs</p>
              <p className="muted">
                Date: {new Date(record.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Records;