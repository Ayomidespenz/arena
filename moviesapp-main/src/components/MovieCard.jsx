import React, { useState } from "react";
import { Link } from "react-router-dom";
import { updateMovie, deleteMovie, getToken } from "../api";

const MovieCard = ({ movie, user, onMovieChanged }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...movie });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => { setEditMode(false); setForm({ ...movie }); setError(""); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      await updateMovie(movie._id, form, token);
      setEditMode(false);
      onMovieChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      await deleteMovie(movie._id, token);
      onMovieChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete movie");
    } finally {
      setLoading(false);
    }
  };

  if (editMode) {
    return (
      <form onSubmit={handleUpdate} className="movie-card">
        <input name="title" value={form.title} onChange={handleChange} className="w-full mb-2 p-2 rounded" required />
        <input name="genre" value={form.genre} onChange={handleChange} className="w-full mb-2 p-2 rounded" required />
        <input name="rating" type="number" value={form.rating} onChange={handleChange} className="w-full mb-2 p-2 rounded" min="0" max="10" required />
        <input name="posterUrl" value={form.posterUrl} onChange={handleChange} className="w-full mb-2 p-2 rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full mb-2 p-2 rounded" required />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white p-2 rounded" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          <button type="button" className="bg-gray-400 text-white p-2 rounded" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie._id}`}>
        <img
          src={movie.posterUrl ? movie.posterUrl : "/images/no-movie.png"}
          alt={movie.title}
        />
        <div className="mt-4">
          <h3>{movie.title}</h3>
          <div className="content">
            <div className="rating">
              <img src="/images/star.svg" alt="star icon" />
              <p>{movie.rating ? movie.rating.toFixed(1) : "N/A"}</p>
            </div>
            <span>•</span>
            <p className="lang">{movie.genre}</p>
          </div>
        </div>
      </Link>
      {user && (
        <div className="flex gap-2 mt-2">
          <button onClick={handleEdit} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-2 py-1 rounded" disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default MovieCard;
