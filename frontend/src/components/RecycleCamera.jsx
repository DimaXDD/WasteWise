import React, { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useDispatch, useSelector } from "react-redux";
import { getPoints } from "../redux/features/point/pointSlice";
import { getMark } from "../redux/features/mark/markSlice";

const factsData = {
  plastic_bottle: [
    "Пластиковые бутылки можно перерабатывать и использовать снова.",
    "Время разложения пластиковой бутылки в природе — около 450 лет!",
    "Переработка одной пластиковой бутылки экономит энергию, достаточную для работы 60-ваттной лампочки в течение 3 часов.",
    "В мире каждую минуту продается около 1 миллиона пластиковых бутылок."
  ],
  paper: [
    "Бумага может перерабатываться до 6 раз, но требует аккуратного обращения.",
    "Переработка одной тонны бумаги спасает 17 деревьев.",
    "В среднем офисный работник использует около 10 000 листов бумаги в год.",
    "Бумага изготавливается из древесной массы, воды и химических веществ."
  ],
  aluminum_can: [
    "Алюминий на 100% пригоден для переработки без потери качества.",
    "Переработка алюминиевой банки экономит 95% энергии по сравнению с производством новой.",
    "Алюминиевые банки можно перерабатывать бесконечное количество раз.",
    "В среднем алюминиевая банка содержит около 70% переработанного материала."
  ],
  glass_bottle: [
    "Стекло перерабатывается неограниченное количество раз.",
    "Переработка одной стеклянной бутылки экономит энергию для работы телевизора в течение 20 минут.",
    "Стекло не выделяет вредных веществ при разложении.",
    "Стеклянные бутылки разлагаются в природе около 4000 лет."
  ],
  tetra_pack: [
    "Тетра Пак состоит из нескольких материалов, что требует сложной переработки.",
    "Упаковка Тетра Пак на 75% состоит из бумаги, 20% полиэтилена и 5% алюминия.",
    "Переработка Тетра Пак помогает сохранить природные ресурсы.",
    "Из переработанного Тетра Пак можно изготовить картон, бумагу и другие материалы."
  ],
};

const RecycleCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(true);
  const [lastCategory, setLastCategory] = useState(null);
  const [shownFacts, setShownFacts] = useState([]);
  const messagesEndRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const dispatch = useDispatch();
  const { points } = useSelector((state) => state.point);
  const { marks } = useSelector((state) => state.mark);
  const [pendingBottleChoice, setPendingBottleChoice] = useState(null);

  useEffect(() => {
    dispatch(getPoints());
    dispatch(getMark());
  }, [dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          } 
        });
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
        startPeriodicDetection(loadedModel);
      } catch (error) {
        console.error("Ошибка при настройке:", error);
      }
    };

    const startPeriodicDetection = (model) => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      
      let lastDetectionTime = 0;
      const detectionInterval = 50;
      
      detectionIntervalRef.current = setInterval(async () => {
        const currentTime = Date.now();
        if (currentTime - lastDetectionTime < detectionInterval) return;
        
        if (isDetectionActive && videoRef.current && canvasRef.current && model) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            try {
              const predictions = await model.detect(videoRef.current);
              drawPredictions(predictions, ctx);
              handleAnalysis(predictions);
              lastDetectionTime = currentTime;
            } catch (error) {
              console.error("Ошибка при анализе:", error);
            }
          }
        }
      }, 50); // Проверяем каждые 50мс, но реальное обнаружение происходит каждые 200мс
    };

    initializeCameraAndModel();

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isDetectionActive]);

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

  // Функция для случайного перемешивания массива
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  // Сопоставление детальных категорий к основным
  const categoryToMain = {
    plastic_bottle: 'Пластик',
    tetra_pack: 'Пластик',
    aluminum_can: 'Металл',
    glass_bottle: 'Стекло', // если нужно, можно добавить 'Стекло' как отдельную категорию
    paper: 'Бумага',
  };

  // Асинхронно "печатает" сообщения по одному
  const typeFactMessages = async (facts, category, callback) => {
    setIsTyping(true);
    let shuffled = shuffle([...facts]);
    // Если категория не поменялась, не показываем те же факты подряд
    if (lastCategory === category && shownFacts.length > 0) {
      shuffled = shuffled.filter(fact => !shownFacts.includes(fact));
      if (shuffled.length === 0) shuffled = shuffle([...facts]);
    }
    setShownFacts(shuffled);
    for (let i = 0; i < shuffled.length; i++) {
      setMessages(prev => [...prev, {
        text: shuffled[i],
        type: 'bot',
        category,
        timestamp: new Date().getTime() + i
      }]);
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    setIsTyping(false);
    if (callback) callback();
  };

  const handleAnalysis = async (predictions) => {
    if (predictions.length > 0 && isDetectionActive) {
      const label = predictions[0].class;
      const category = mapToCategory(label);
      if (category === 'plastic_bottle' || category === 'glass_bottle') {
        // Если просто 'bottle', спрашиваем пользователя
        if (label === 'bottle' || label.includes('bottle')) {
          setIsDetectionActive(false);
          setPendingBottleChoice({
            label,
            timestamp: new Date().getTime(),
          });
          setMessages([
            {
              type: 'choice',
              text: 'Это пластиковая или стеклянная бутылка?',
              timestamp: new Date().getTime(),
            }
          ]);
          return;
        }
      }
      if (category) {
        setIsDetectionActive(false);
        setLastCategory(category);
        const mainCategory = categoryToMain[category] || 'Другое';
        const filteredPoints = points.filter(point => point.rubbish && point.rubbish.toLowerCase().includes(mainCategory.toLowerCase()));
        setMessages([]);
        await typeFactMessages(factsData[category], category, () => {
          setMessages(prev => [
            ...prev,
            {
              type: 'bot',
              text: filteredPoints.length > 0
                ? `Вот где вы можете сдать: ${mainCategory}`
                : `В вашем городе пока нет пунктов для сдачи: ${mainCategory}`,
              points: filteredPoints,
              timestamp: new Date().getTime() + 1000,
              rubbishName: mainCategory,
            },
            {
              type: 'action',
              text: '',
              timestamp: new Date().getTime() + 1001,
              category,
            }
          ]);
        });
      }
    }
  };

  // Обработка выбора пользователя для бутылки
  const handleBottleChoice = async (choice) => {
    setPendingBottleChoice(null);
    setIsDetectionActive(false);
    setLastCategory(choice);
    const mainCategory = categoryToMain[choice] || 'Другое';
    const filteredPoints = points.filter(point => point.rubbish && point.rubbish.toLowerCase().includes(mainCategory.toLowerCase()));
    setMessages([]);
    await typeFactMessages(factsData[choice], choice, () => {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: filteredPoints.length > 0
            ? `Вот где вы можете сдать: ${mainCategory}`
            : `В вашем городе пока нет пунктов для сдачи: ${mainCategory}`,
          points: filteredPoints,
          timestamp: new Date().getTime() + 1000,
          rubbishName: mainCategory,
        },
        {
          type: 'action',
          text: '',
          timestamp: new Date().getTime() + 1001,
          category: choice,
        }
      ]);
    });
  };

  const handleContinue = () => {
    setIsDetectionActive(true); // Возобновляем обнаружение
    setMessages([]); // Очищаем все сообщения
  };

  return (
    <div className="container" style={styles.container}>
      <h1 className="header" style={styles.header}>Определение вторсырья</h1>
      <div className="content-wrapper" style={styles.contentWrapper}>
        <div className="camera-container" style={styles.cameraContainer}>
          <video ref={videoRef} style={styles.video} />
          <canvas ref={canvasRef} className="video-canvas" style={styles.canvas} />
        </div>
        <div className="chat-container" style={styles.chatContainer}>
          <div className="chat-header" style={styles.chatHeader}>
            <div className="bot-avatar" style={styles.botAvatar}>
              🤖
            </div>
            <span style={styles.botName}>Эко-бот</span>
          </div>
          <div className="messages" style={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={message.timestamp}
                className={`message ${message.type}`}
                style={{
                  ...styles.message,
                  ...(message.type === 'bot' ? styles.botMessage : 
                       message.type === 'action' ? styles.actionMessage : styles.userMessage),
                  animation: 'fadeIn 0.3s ease-in'
                }}
              >
                {message.text}
                {message.type === 'choice' && (
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => handleBottleChoice('plastic_bottle')}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Пластиковая
                    </button>
                    <button
                      onClick={() => handleBottleChoice('glass_bottle')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                      Стеклянная
                    </button>
                  </div>
                )}
                {message.type === 'bot' && message.points && message.points.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {message.points.map((point) => (
                      <li key={point.id} className="bg-white rounded-lg p-3 border border-emerald-200 shadow-sm">
                        <div className="font-semibold text-emerald-700">{point.point_name}</div>
                        <div className="text-slate-700 text-sm">{point.address}</div>
                        <div className="text-slate-500 text-xs">Время работы: {point.time_of_work}</div>
                        <div className="text-slate-500 text-xs">Принимает: {point.rubbish}</div>
                        <a href={point.link_to_map} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-xs underline">Открыть на карте</a>
                      </li>
                    ))}
                  </ul>
                )}
                {message.type === 'action' && (
                  <button 
                    onClick={handleContinue}
                    style={styles.continueButton}
                  >
                    Продолжить определение
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
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
  contentWrapper: {
    display: "flex",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
    justifyContent: "center",
  },
  cameraContainer: {
    position: "relative",
    width: "50%",
    maxWidth: "600px",
  },
  video: {
    display: "none",
  },
  canvas: {
    width: "100%",
    border: "2px solid #000",
    borderRadius: "12px",
  },
  chatContainer: {
    width: '50%',
    maxWidth: '500px',
    height: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  chatHeader: {
    padding: '12px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  botAvatar: {
    width: '32px',
    height: '32px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  botName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  messages: {
    height: 'calc(100% - 56px)',
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f5f5f5',
  },
  message: {
    margin: '8px 0',
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '85%',
    wordWrap: 'break-word',
    position: 'relative',
  },
  botMessage: {
    backgroundColor: '#ffffff',
    marginRight: 'auto',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  userMessage: {
    backgroundColor: '#e3f2fd',
    marginLeft: 'auto',
  },
  typingIndicator: {
    display: 'inline-flex',
    gap: '4px',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
  actionMessage: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: '8px',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
};

// Добавляем стили для анимации
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .typing-indicator span {
    width: 8px;
    height: 8px;
    background-color: #4CAF50;
    border-radius: 50%;
    display: inline-block;
    animation: typing 1s infinite;
  }
  
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`;
document.head.appendChild(styleSheet);

export default RecycleCamera;