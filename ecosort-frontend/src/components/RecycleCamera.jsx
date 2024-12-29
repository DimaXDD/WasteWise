import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const factsData = {
  plastic_bottle: {
    title: "Пластиковая бутылка",
    description: "Пластиковые бутылки можно перерабатывать и использовать снова.",
    image: "/images/plastic_bottle.jpg",
  },
  paper: {
    title: "Бумага",
    description: "Бумага может перерабатываться до 6 раз, но требует аккуратного обращения.",
    image: "/images/paper.jpg",
  },
  aluminum_can: {
    title: "Алюминиевая банка",
    description: "Алюминий на 100% пригоден для переработки без потери качества.",
    image: "/images/aluminum_can.jpg",
  },
  glass_bottle: {
    title: "Стеклянная бутылка",
    description: "Стекло перерабатывается неограниченное количество раз.",
    image: "/images/glass_bottle.jpg",
  },
  tetra_pack: {
    title: "Тетра Пак",
    description: "Тетра Пак состоит из нескольких материалов, что требует сложной переработки.",
    image: "/images/tetra_pack.jpg",
  },
};

const RecycleCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [fact, setFact] = useState(null);

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
        requestAnimationFrame(processFrame);
      };

      processFrame();
    };

    initializeCameraAndModel();
  }, []);

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
      } else {
        setFact({
          title: "Неизвестный объект",
          description: "Факты для данного объекта не найдены.",
        });
      }
    } else {
      setFact(null);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <h1 className="header" style={styles.header}>Определение вторсырья</h1>
      <div className="camera-container" style={styles.cameraContainer}>
        <video ref={videoRef} style={styles.video} />
        <canvas ref={canvasRef} className="video-canvas" style={styles.canvas} />
      </div>
      {fact && (
        <div className="fact-card" style={styles.factCard}>
          <h2 style={styles.factTitle}>{fact.title}</h2>
          <p style={styles.factDescription}>{fact.description}</p>
          {fact.image && <img src={fact.image} alt={fact.title} style={styles.factImage} />}
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
  factCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    maxWidth: "400px",
    textAlign: "center",
  },
  factTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  factDescription: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  factImage: {
    maxWidth: "100%",
    borderRadius: "8px",
  },
};

export default RecycleCamera;
