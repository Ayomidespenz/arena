import { useEffect, useState } from "react";
import Search from "./components/search";
import { Spinner } from "flowbite-react";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getMovies, getToken, removeToken } from "./api";
import { Routes, Route, useNavigate } from "react-router-dom";
import MovieDetails from "./components/MovieDetails";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddMovie from "./components/AddMovie";

const Home = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      const params = query ? { genre: query } : {};
      const response = await getMovies(params);
      setMovieList(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error fetching movies. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMovies = () => fetchMovies(debouncedSearchTerm);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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
          <div className="flex gap-4 justify-center mt-4">
            {user ? (
              <span className="text-green-400">Welcome, {user.username || user.email}!</span>
            ) : (
              <>
                <a href="/login" className="text-blue-400 underline">Login</a>
                <a href="/signup" className="text-green-400 underline">Sign Up</a>
              </>
            )}
          </div>
        </header>
        {user && <AddMovie onMovieAdded={refreshMovies} />}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie._id} movie={movie} user={user} onMovieChanged={refreshMovies} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for token on mount
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      // Optionally decode token for user info, or fetch user profile from backend
      // For now, just set a dummy user
      setUser({ email: "Logged in" });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/");
  };
  const handleSignup = (userData) => {
    setUser(userData);
    navigate("/");
  };
  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <nav className="flex justify-end gap-4 p-4">
        {user ? (
          <button onClick={handleLogout} className="text-red-400 underline">Logout</button>
        ) : null}
      </nav>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
      </Routes>
    </>
  );
};

export default App;
