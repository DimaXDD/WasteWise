import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import plasticBottle from "../image/plastic_bottle.png";


const factsData = {
  plastic_bottle: {
    title: "Пластиковая бутылка",
    description: "Пластиковые бутылки можно перерабатывать и использовать снова.",
    image: plasticBottle,
  },
  paper: {
    title: "Бумага",
    description: "Бумага может перерабатываться до 6 раз, но требует аккуратного обращения.",
    image: "/image/paper.jpg",
  },
  aluminum_can: {
    title: "Алюминиевая банка",
    description: "Алюминий на 100% пригоден для переработки без потери качества.",
    image: "/image/aluminum_can.jpg",
  },
  glass_bottle: {
    title: "Стеклянная бутылка",
    description: "Стекло перерабатывается неограниченное количество раз.",
    image: "/image/glass_bottle.jpg",
  },
  tetra_pack: {
    title: "Тетра Пак",
    description: "Тетра Пак состоит из нескольких материалов, что требует сложной переработки.",
    image: "/image/tetra_pack.jpg",
  },
};

const RecycleCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [fact, setFact] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const mapToCategory = (label) => {
    if (label.includes("bottle")) return "plastic_bottle";
    if (label.includes("paper")) return "paper";
    if (label.includes("can")) return "aluminum_can";
    if (label.includes("glass")) return "glass_bottle";
    if (label.includes("tetra")) return "tetra_pack";
    return null;
  };

  useEffect(() => {
    const initializeCameraAndModel = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play();
            }
          };
        }

        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        startRealTimeAnalysis(loadedModel);
      } catch (error) {
        console.error("Ошибка при настройке:", error);
      }
    };

    const startRealTimeAnalysis = (model) => {
      const processFrame = async () => {
        if (videoRef.current && canvasRef.current && model) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;

          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          try {
            const predictions = await model.detect(videoRef.current);
            drawPredictions(predictions, ctx);
            handleAnalysis(predictions);
          } catch (error) {
            console.error("Ошибка при анализе:", error);
          }
        }
        if (!isPopupVisible) {
          requestAnimationFrame(processFrame);
        }
      };

      processFrame();
    };

    initializeCameraAndModel();
  }, [isPopupVisible]);

  const drawPredictions = (predictions, ctx) => {
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.font = "16px Arial";
      ctx.fillStyle = "#FF0000";
      ctx.fillText(prediction.class, x, y > 10 ? y - 5 : y + 20);
    });
  };

  const handleAnalysis = (predictions) => {
    if (predictions.length > 0) {
      const category = mapToCategory(predictions[0].class);
      if (category && factsData[category]) {
        setFact(factsData[category]);
        setIsPopupVisible(true);
        videoRef.current?.pause(); // Pause the video
      }
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setFact(null);
    videoRef.current?.play(); // Resume the video
  };

  return (
    <div className="container" style={styles.container}>
      <h1 className="header" style={styles.header}>Определение вторсырья</h1>
      <div
        className="camera-container"
        style={{ ...styles.cameraContainer, display: isPopupVisible ? "none" : "block" }}
      >
        <video ref={videoRef} style={styles.video} />
        <canvas ref={canvasRef} className="video-canvas" style={styles.canvas} />
      </div>
      {isPopupVisible && fact && (
        <div className="popup" style={styles.popup}>
          <div className="popup-content" style={styles.popupContent}>
            <h2>{fact.title}</h2>
            <p>{fact.description}</p>
            {fact.image && <img src={fact.image} alt={fact.title} style={styles.factImage} />}
            <button onClick={closePopup} style={styles.closeButton}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    minHeight: "100vh",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  cameraContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "20px",
  },
  video: {
    display: "none",
  },
  canvas: {
    width: "100%",
    border: "2px solid #000",
  },
  popup: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  factImage: {
    maxWidth: "100%",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#ff0000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default RecycleCamera;
