import React, { useState, useEffect } from "react";
import "./styles.css";

const DogGallery = () => {
  const [breeds, setBreeds] = useState({});
  const [selectedBreed, setSelectedBreed] = useState("");
  const [DogImages, setDogImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (selectedBreed) {
      fetchDogImages(selectedBreed);
    }
  }, [selectedBreed]);

  const fetchBreeds = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/list/all");
      if (!response.ok) throw new Error("Failed to fetch breeds");

      const data = await response.json();
      if (data.status === "success") {
        setBreeds(data.message);
      } else {
        throw new Error("Failed to get breeds data");
      }
    } catch (err) {
      setError("Error loading breeds: " + err.message);
    }
  };

  const fetchDogImages = async (breed) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      if (data.status === "success") {
        const processedImages = data.message.map((url, index) => ({
          id: index + 1,
          url: url,
          title: `${breed.split("/").join(" ")} ${index + 1}`,
        }));
        setDogImages(processedImages);
      } else {
        throw new Error("Failed to get breed images");
      }
    } catch (err) {
      setError("Error loading images: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBreedOptions = () => {
    const options = [];
    for (const [breed, subBreeds] of Object.entries(breeds)) {
      if (subBreeds.length === 0) {
        options.push(breed);
      } else {
        subBreeds.forEach((subBreed) => {
          options.push(`${breed}/${subBreed}`);
        });
      }
    }
    return options.sort();
  };

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
    setTimeout(() => setModalActive(true), 10);
  };

  const closeModal = () => {
    setModalActive(false);
    setTimeout(() => {
      setSelectedImage(null);
      document.body.style.overflow = "unset";
    }, 300);
  };

  const LoadingCards = () => (
    <div>
      {[...Array(8)].map((_, index) => (
        <div key={index} className="loading-card">
          <div className="loading-image" />
          <div className="loading-content">
            <div className="loading-title" />
          </div>
        </div>
      ))}
    </div>
  );

  const Modal = ({ image }) => {
    if (!image) return null;

    return (
      <div
        className={`modal-overlay ${modalActive ? "active" : ""}`}
        onClick={closeModal}
      >
        <div
          className={`modal-content ${modalActive ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={image.url} alt={image.title} className="modal-image" />
          <button className="close-button" onClick={closeModal}>
            ×
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="breed-gallery">
      <div className="header">
        <h1 className="gallery-title">Dog Breed Gallery</h1>
        <select
          className="breed-select"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">Select a breed</option>
          {getBreedOptions().map((breed) => (
            <option key={breed} value={breed}>
              {breed
                .split("/")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button
            className="retry-button"
            onClick={() => selectedBreed && fetchDogImages(selectedBreed)}
          >
            Retry
          </button>
        </div>
      )}

      <div className="gallery-grid">
        {loading ? (
          <LoadingCards />
        ) : (
          DogImages.map((image) => (
            <div
              key={image.id}
              className="dog-card"
              onClick={() => openModal(image)}
            >
              <div className="card-image-container">
                <img
                  src={image.url}
                  alt={image.title}
                  className="card-image"
                  loading="lazy"
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">{image.title}</h3>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal image={selectedImage} />
    </div>
  );
};

export default DogGallery;
