import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

// Import all project images
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
};

// Import all images from the projects folder
const projectImages = importAll(
  require.context("../data/misc/projects", false, /\.(png|jpe?g|svg)$/)
);

// Import all videos from the projects/videos folder
const projectVideos = importAll(
  require.context("../data/misc/projects/videos", false, /\.(mp4|webm|mov)$/)
);

const ImageGallery = ({ images = [], videos = [], projectTitle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideos, setPlayingVideos] = useState(new Set());

  // Combine and memoize media array
  const allMedia = useMemo(() => {
    return [
      ...images.map((img) => ({ type: "image", src: img })),
      ...videos.map((vid) => ({ type: "video", src: vid })),
    ];
  }, [images, videos]);

  // Handle keyboard navigation and body scroll lock
  useEffect(() => {
    if (!isModalOpen) return;

    const scrollY = window.scrollY;
    document.body.style.cssText = `position: fixed; top: -${scrollY}px; width: 100%; overflow: hidden;`;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          setIsModalOpen(false);
          break;
        case "ArrowLeft":
          setCurrentIndex((prev) =>
            prev === 0 ? allMedia.length - 1 : prev - 1
          );
          break;
        case "ArrowRight":
          setCurrentIndex((prev) =>
            prev === allMedia.length - 1 ? 0 : prev + 1
          );
          break;
        case " ":
          if (allMedia[currentIndex]?.type === "video") {
            const video = document.querySelector(".video-container video");
            if (video && document.activeElement !== video) {
              e.preventDefault();
              video.paused ? video.play() : video.pause();
            }
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.cssText = "";
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, allMedia, currentIndex]);

  const getMediaPath = (mediaItem) => {
    if (!mediaItem?.src) return null;

    if (mediaItem.type === "image") {
      const imagePath = projectImages[mediaItem.src];
      if (imagePath) {
        return imagePath.default || imagePath;
      }
    } else if (mediaItem.type === "video") {
      const videoPath = projectVideos[mediaItem.src];
      if (videoPath) {
        return videoPath.default || videoPath;
      }
    }

    console.warn(`${mediaItem.type} not found: ${mediaItem.src}`);
    return null;
  };

  const isVideoThumbnail = (src) => src?.includes("_thumbnail");

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    // Remove focus to prevent spacebar button activation
    setTimeout(() => document.activeElement?.blur(), 100);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) setIsModalOpen(false);
  };

  const navigate = (direction) => {
    setCurrentIndex((prev) => {
      const newIndex = direction === "next" ? prev + 1 : prev - 1;
      return newIndex < 0 ? allMedia.length - 1 : newIndex % allMedia.length;
    });
  };

  const renderMediaItem = (media, index) => {
    const mediaPath = getMediaPath(media);
    if (!mediaPath) return null;

    if (media.type === "video") {
      const isPlaying = playingVideos.has(index);

      return (
        <div key={`${media.type}-${index}`} className="image-item video-item">
          <video
            src={mediaPath}
            muted
            loop
            onClick={(e) => {
              e.stopPropagation();
              const video = e.target;
              if (video.paused) {
                video.play();
                setPlayingVideos((prev) => new Set([...prev, index]));
              } else {
                video.pause();
                setPlayingVideos((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(index);
                  return newSet;
                });
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openModal(index);
            }}
            onPause={() => {
              setPlayingVideos((prev) => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
              });
            }}
            onPlay={() => {
              setPlayingVideos((prev) => new Set([...prev, index]));
            }}
            style={{ cursor: "pointer" }}
          />
          <div
            className="video-overlay"
            onClick={(e) => {
              e.stopPropagation();
              openModal(index);
            }}
            style={{
              cursor: "pointer",
              opacity: isPlaying ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <div className="play-button">▶</div>
          </div>
        </div>
      );
    }

    // For images and video thumbnails
    const commonProps = {
      key: `${media.type}-${index}`,
      className: `image-item ${media.type === "video" ? "video-item" : ""}`,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(index);
      },
    };

    return (
      <div {...commonProps}>
        <img src={mediaPath} alt={`${projectTitle} - ${index + 1}`} />
        {isVideoThumbnail(media.src) && (
          <div className="video-overlay">
            <div className="play-button">▶</div>
          </div>
        )}
      </div>
    );
  };

  if (!allMedia.length) return null;

  return (
    <>
      <div className="image-gallery">
        {allMedia.map((media, index) => renderMediaItem(media, index))}
      </div>

      {isModalOpen &&
        createPortal(
          <div className="image-modal" onClick={handleModalClick}>
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>

              <div className="modal-image-container">
                <button className="modal-prev" onClick={() => navigate("prev")}>
                  ‹
                </button>
                <button className="modal-next" onClick={() => navigate("next")}>
                  ›
                </button>

                {renderModalContent()}
              </div>

              <div className="modal-counter">
                {currentIndex + 1} / {allMedia.length}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );

  function renderModalContent() {
    const currentMedia = allMedia[currentIndex];
    if (!currentMedia) return null;

    const mediaPath = getMediaPath(currentMedia);
    if (!mediaPath) return null;

    const modalStyle = {
      maxWidth: "calc(100% - 120px)",
      maxHeight: "calc(100% - 80px)",
      width: "auto",
      height: "auto",
      margin: "0 60px 40px 60px",
    };

    if (currentMedia.type === "video") {
      return (
        <div
          className="video-container"
          style={{
            ...modalStyle,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <video
            src={mediaPath}
            controls
            autoPlay
            alt={`${projectTitle} - Video ${currentIndex + 1}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              cursor: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          />
        </div>
      );
    }

    return (
      <>
        <img
          src={mediaPath}
          alt={`${projectTitle} - ${currentIndex + 1}`}
          style={modalStyle}
        />
        {isVideoThumbnail(currentMedia.src) && (
          <div className="modal-video-overlay">
            <div className="modal-play-button">▶</div>
          </div>
        )}
      </>
    );
  }
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  videos: PropTypes.arrayOf(PropTypes.string),
  projectTitle: PropTypes.string.isRequired,
};

export default ImageGallery;
