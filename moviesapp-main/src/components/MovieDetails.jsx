import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { getMovie } from "../api";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await getMovie(movieId);
        setMovie(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load movie details.");
      } finally {
        setIsLoading(false);
      }
    };
    if (movieId) {
      fetchDetails();
    }
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl p-10">
        Error: {error}
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center text-xl p-10">Movie not found.</div>;
  }

  return (
    <>
      <div className="pattern" />
      <div className="movie-details-padded-container p-4 md:p-8 relative z-10">
        <div className="wrapper">
          <Link
            to="/"
            className="text-blue-500 hover:underline mb-6 inline-block"
          >
            &larr; Back to Home
          </Link>
          <div className="md:flex gap-8">
            <div className="md:w-1/3">
              <img
                src={
                  movie.posterUrl
                    ? movie.posterUrl
                    : "/images/no-movie.png"
                }
                alt={movie.title}
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="md:w-2/3 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                {movie.title}
              </h1>
              <div className="flex items-center mb-4 text-gray-400">
                <img
                  src="/images/star.svg"
                  alt="star icon"
                  className="w-5 h-5 mr-1"
                />
                <span>
                  {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                </span>
                <span className="mx-2">|</span>
                <span>{movie.genre}</span>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
