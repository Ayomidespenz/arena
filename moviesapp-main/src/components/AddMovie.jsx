import React, { useState } from "react";
import { createMovie, getToken } from "../api";

const AddMovie = ({ onMovieAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      await createMovie({ title, description, genre, rating, posterUrl }, token);
      setTitle(""); setDescription(""); setGenre(""); setRating(""); setPosterUrl("");
      onMovieAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-dark-100 rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-white">Add Movie</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full mb-3 p-2 rounded" required />
      <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} className="w-full mb-3 p-2 rounded" required />
      <input type="number" placeholder="Rating (0-10)" value={rating} onChange={e => setRating(e.target.value)} className="w-full mb-3 p-2 rounded" min="0" max="10" required />
      <input type="text" placeholder="Poster URL" value={posterUrl} onChange={e => setPosterUrl(e.target.value)} className="w-full mb-3 p-2 rounded" />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full mb-3 p-2 rounded" required />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>{loading ? "Adding..." : "Add Movie"}</button>
    </form>
  );
};

export default AddMovie; 