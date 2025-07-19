import { useEffect, useState } from "react";
import Search from "./components/search";
import { Spinner } from "flowbite-react";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
import { getTrendingMovies } from "./appwrite";
import { Routes, Route, useParams } from "react-router-dom";
import MovieDetails from "./components/MovieDetails";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      let endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&api_key=${API_KEY}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      // Add language parameter if needed, e.g., &language=en-US
      endpoint += `&language=en-US`;

      const response = await fetch(endpoint); // No longer pass API_OPTIONS with Bearer token
      if (!response.ok) {
        // Check for specific TMDB error response if possible
        if (response.status === 401) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.status_message ||
              "Failed to fetch movies (Unauthorized - check API Key)."
          );
        } else {
          throw new Error(
            `Failed to fetch movies (status: ${response.status})`
          );
        }
      }
      const data = await response.json();

      // TMDB API does not use data.Response === "False" like OMDB
      // It directly returns results or an error object with status_code/status_message
      if (data.results) {
        setMovieList(data.results);
      } else {
        setMovieList([]);
        // TMDB errors often have status_message
        setErrorMessage(
          data.status_message || "No results or failed to fetch movies"
        );
      }

      if (query && data.results && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage(
        error.message || "Error fetching movies. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/images/hero.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <p className="text-white text-center">
            Welcome to our movie recommendation platform! We're here to help you
            discover movies that you'll love.
          </p>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}.</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
      {/* <Route path="/about" element={<About />} />  */}
    </Routes>
  );
};

export default App;
