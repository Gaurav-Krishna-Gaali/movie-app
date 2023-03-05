import React, { useState, useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";
import TextEffect from "./components/TextEffect";

export const API_KEY = "e61dda92";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const FavSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  font-weight: bold;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly; ;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");

  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, setSelectedmovie] = useState();
  const [favourites, setFavourites] = useState([]);

  const [timeoutId, updateTimeoutId] = useState();

  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`
    );
    updateMovieList(response.data.Search);
  };

  const onTextChange = (e) => {
    setSelectedmovie("");
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 200);
    updateTimeoutId(timeout);
  };

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem("react-movie-app-favourites")
    );

    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    if (favourites.includes(movie)) {
      return;
    } else {
      setFavourites(newFavouriteList);
      saveToLocalStorage(newFavouriteList);
    }
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src="/movie/movie-icon.svg" />
          React Movie App
        </AppName>
        <SearchBox>
          <SearchIcon src="/movie/search-icon.svg" />
          <SearchInput
            placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      {/* Favourites */}

      {/* {favourites.length > 0 ? (
        <FavSection>My Favourites</FavSection>
      ) : (
        <FavSection>No Favourites currently selected</FavSection>
      )} */}
      {searchQuery === "" && (
        <TextEffect
          text={
            favourites.length > 0
              ? "My Favourites 🎬"
              : "No Favourites currently selected 🔍"
          }
        />
      )}
      {searchQuery === "" && (
        <MovieListContainer>
          {favourites.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              addFavouriteMovie={addFavouriteMovie}
              removeFavouriteMovie={removeFavouriteMovie}
              favourites={favourites}
            />
          ))}
        </MovieListContainer>
      )}

      {selectedMovie && (
        <MovieInfoComponent
          selectedMovie={selectedMovie}
          setSelectedmovie={setSelectedmovie}
        />
      )}
      <MovieListContainer>
        {movieList?.length ? (
          movieList.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              setSelectedmovie={setSelectedmovie}
              addFavouriteMovie={addFavouriteMovie}
              removeFavouriteMovie={removeFavouriteMovie}
              favourites={favourites}
            />
          ))
        ) : (
          <Placeholder src="/movie/movie-icon.svg" />
        )}
      </MovieListContainer>
    </Container>
  );
}

export default App;
