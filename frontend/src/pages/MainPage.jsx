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

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(`${API.subscribe}?email=${userEmail}`, {
          method: 'GET',
        });
  
        const data = await res.json();

        // Handle cases where body is a string that needs parsing
        const parsed = typeof data.body === 'string' ? JSON.parse(data.body) : data;
        setSubscriptions(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
        setSubscriptions([]); // fallback to empty array
      }
    };
  
    if (userEmail) {
      fetchSubscriptions();
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleQuery = async () => {
    setNoResults(false);
    setQueryResults([]);
  
    if (!titleInput && !artistInput && !yearInput && !albumInput) {
      alert('Please fill in at least one field');
      return;
    }

      // DUMMY DATA - remove when CORS is fixed
    const dummyResults = [
      {
        title: 'Shake It Off',
        artist: 'Taylor Swift',
        album: '1989',
        year: 2014,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png'
      },
      {
        title: 'Blank Space',
        artist: 'Taylor Swift',
        album: '1989',
        year: 2014,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/440px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png'
      }
    ];

    if (dummyResults.length === 0) {
      setNoResults(true);
    } else {
      setQueryResults(dummyResults);
    }
  
    // try {
    //   const params = new URLSearchParams();
    //   if (artistInput) params.append('artist', artistInput);
    //   if (albumInput) params.append('album', albumInput);
    //   if (yearInput) params.append('year', yearInput);
    //   if (titleInput) params.append('title', titleInput);
  
    //   const res = await fetch(`${API.query}?${params.toString()}`, {
    //     method: 'GET',
    //   });
  
    //   const data = await res.json();
  
    //   if (data.length === 0) {
    //     setNoResults(true);
    //   } else {
    //     setQueryResults(data);
    //   }
    // } catch (err) {
    //   console.error('Query error:', err);
    // }
  };

  const handleSubscribe = async (song) => {
    try {
      const res = await fetch(API.subscribe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          artist: song.artist,
          title: song.title,
          album: song.album,
          year: song.year,
          image_url: song.image_url,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Add to subscriptions list immediately without re-fetching
        setSubscriptions((prev) => [...prev, song]);
      } else {
        alert(data || 'Already subscribed');
      }
    } catch (err) {
      console.error('Subscribe error:', err);
    }
  };

  const handleRemove = async (song) => {
    try {
      const params = new URLSearchParams({
        email: userEmail,
        artist: song.artist,
        title: song.title,
        album: song.album,
      });
  
      const res = await fetch(`${API.remove}?${params.toString()}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        setSubscriptions((prev) =>
          prev.filter(
            (s) => !(s.artist === song.artist && s.title === song.title && s.album === song.album)
          )
        );
      } else {
        alert('Failed to remove');
      }
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  // Helper to extract title from album_title composite key
  const getTitle = (song) => {
    if (song.album_title) {
      return song.album_title.split('#')[1];
    }
    return song.title;
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
                  <h3>{getTitle(song)}</h3>
                  <p>
                    {song.artist} - {song.album} ({song.year})
                  </p>
                </div>
                <button className="remove-btn" onClick={() => handleRemove(song)}>Remove</button>
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
          <button className="search-btn" onClick={handleQuery}>Search</button>
        </div>

        {noResults && <p className="empty-msg"> No result is retrieved. Please query again</p>}

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
              <button className="subscribe-btn" onClick={() => handleSubscribe(song)}>Subscribe</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}