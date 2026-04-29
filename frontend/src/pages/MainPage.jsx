import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
import "../styles/MainPage.css";

export default function MainPage() {
  const navigate = useNavigate();

  const userEmail = sessionStorage.getItem("user_email");
  const userName = sessionStorage.getItem("user_name");

  const [subscriptions, setSubscriptions] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const [titleInput, setTitleInput] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [albumInput, setAlbumInput] = useState("");

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!userEmail) {
      navigate("/");
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="main-page">
      <div className="main-header">
        <h1>Tune Vault</h1>
        <div className="main-user-info">
          <span>Welcome, {userName}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="section">
        <h2>Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p>You have no subscriptions yet.</p>
        ) : (
          <div className="subscription-list">
            {subscriptions.map((song, index) => (
              <div key={index} className="song-card">
                <img
                  src={song.image_url}
                  alt={song.artist}
                  className="artist-img"
                />
                <div className="song-info">
                  <h3>{song.title}</h3>
                  <p>
                    {song.artist} - {song.album} ({song.year})
                  </p>
                </div>
                <button className="remove-btn">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h2>Search Tunes</h2>
        <div className="search-form">
          <input
            type="text"
            placeholder="Title"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Artist"
            value={artistInput}
            onChange={(e) => setArtistInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Year"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Album"
            value={albumInput}
            onChange={(e) => setAlbumInput(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>

        {noResults && <p className="empty-msg"> No results availbable. Please search for a different tune.</p>}

        <div className="search-results">
          {queryResults.map((song, index) => (
            <div key={index} className="song-card">
              <img
                src={song.image_url}
                alt={song.artist}
                className="artist-img"
              />
              <div className="song-info">
                <h3>{song.title}</h3>
                <p>
                  {song.artist} - {song.album} ({song.year})
                </p>
              </div>
              <button className="subscribe-btn">Subscribe</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}