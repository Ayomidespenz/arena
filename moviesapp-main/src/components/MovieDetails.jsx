import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "flowbite-react"; // Modal import is no longer needed here
import SimpleModal from "./SimpleModal"; // Import the new simple modal

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrailerModal, setShowTrailerModal] = useState(false); // State for modal

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError("");
      try {
        // Fetch movie details
        const movieResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        if (!movieResponse.ok) {
          throw new Error("Failed to fetch movie details.");
        }
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch movie videos (trailers, etc.)
        const videosResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );
        if (!videosResponse.ok) {
          throw new Error("Failed to fetch movie videos.");
        }
        const videosData = await videosResponse.json();
        setVideos(videosData.results || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not load movie details.");
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

  const trailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

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
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
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
              <p className="text-lg text-gray-300 mb-4">{movie.tagline}</p>

              <div className="flex items-center mb-4 text-gray-400">
                <img
                  src="/images/star.svg"
                  alt="star icon"
                  className="w-5 h-5 mr-1"
                />
                <span>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} (
                  {movie.vote_count} votes)
                </span>
                <span className="mx-2">|</span>
                <span>{movie.runtime} min</span>
                <span className="mx-2">|</span>
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Actions</h2>
                {trailer && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 transition duration-150 ease-in-out"
                    onClick={() => setShowTrailerModal(true)}
                  >
                    Watch Trailer
                  </button>
                )}
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                  onClick={() =>
                    alert("Download functionality is a placeholder.")
                  }
                >
                  Download (Dummy)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimpleModal
        show={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
        title={movie ? movie.title : "Test Title"}
      >
        {trailer ? (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <p>No trailer available for this movie.</p>
        )}
      </SimpleModal>
    </>
  );
};

export default MovieDetails;
