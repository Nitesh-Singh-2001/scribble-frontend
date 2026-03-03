import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../services/socket';
import { useGame } from '../context/GameContext';

// Components
import PlayerList from '../components/leftsidebar/PlayerList';
import ChatBox from '../components/rightsidebar/ChatBox';
import Canvas from '../components/Canvas';
import WordHint from '../components/gamecenter/WordHint';
import WordSelectionModal from '../components/WordSelectionModal';

const GameRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.name || "Guest";

  const { gameState, setGameState } = useGame();
  const [choices, setChoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameOver, setGameOver] = useState(null); // { winner: {}, players: [] }
  
  const [selectedColor, setSelectedColor] = useState("#000000");
  const colorOptions = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#8B4513"];

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("join_room", { name: username, room: roomId });
    }

    const onReceiveWordChoices = (words) => {
      setChoices(words);
      setShowModal(true);
    };

    const onRoundStarted = (data) => {
      setShowModal(false);
      setChoices([]); 
      setTimeLeft(data.timeLeft);
      if (data.currentRound) setCurrentRound(data.currentRound);

      setGameState(prev => ({ 
        ...prev, 
        wordHint: data.wordHint,
        players: data.players || prev.players 
      }));
    };

    const onTimerUpdate = (time) => {
      setTimeLeft(time);
    };

    const onUpdateGame = (data) => {
       setGameState((prev) => ({ ...prev, ...data }));
       if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft);
       if (data.currentRound !== undefined) setCurrentRound(data.currentRound);
    };

    const onGameOver = (data) => {
      setGameOver(data);
    };

    socket.on("receive_word_choices", onReceiveWordChoices);
    socket.on("round_started", onRoundStarted);
    socket.on("timer_update", onTimerUpdate);
    socket.on("update_game", onUpdateGame);
    socket.on("game_over", onGameOver);

    return () => {
      socket.off("receive_word_choices", onReceiveWordChoices);
      socket.off("round_started", onRoundStarted);
      socket.off("timer_update", onTimerUpdate);
      socket.off("update_game", onUpdateGame);
      socket.off("game_over", onGameOver);
    };
  }, [roomId, username, setGameState]);

  const currentPlayer = gameState.players.find((p) => p.id === socket.id);
  const isDrawer = currentPlayer?.isDrawing || false;

  const handleWordSelect = (word) => {
    socket.emit("select_word", { room: roomId, word });
    setShowModal(false);
    setChoices([]); 
  };

  const handleReturnToLobby = () => {
    navigate("/");
  };

  const hasStarted = gameState.hasStarted;

  return (
    <div className="flex h-screen w-screen bg-slate-900 overflow-hidden text-white font-sans relative">
      
      {/* Waiting / Start Game Overlay */}
      {hasStarted === false && !gameOver && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md">
          <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl border-2 border-slate-600 w-full max-w-lg text-center transform scale-100 transition-all">
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-widest">Waiting Room</h2>
            <p className="text-slate-300 mb-8 text-lg">
              {gameState.players.length < 2 
                ? "Waiting for more players to join..." 
                : "Ready to start the game!"}
            </p>
            
            <div className="flex justify-center mb-8">
               <div className="flex -space-x-4">
                 {gameState.players.map((p) => (
                   <div key={p.id} className="w-12 h-12 rounded-full border-2 border-slate-800 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-sm shadow-md" title={p.name}>
                     {p.name.substring(0, 2).toUpperCase()}
                   </div>
                 ))}
               </div>
            </div>

            <button 
              onClick={() => socket.emit("start_game", roomId)}
              disabled={gameState.players.length < 2}
              className={`w-full py-4 font-black rounded-xl text-lg uppercase tracking-widest transition-all shadow-lg ${
                gameState.players.length >= 2 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-900 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(250,204,21,0.3)]" 
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              {gameState.players.length < 2 ? `Need at least 2 players (${gameState.players.length}/2)` : "Start Game"}
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
           <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border-2 border-yellow-400 w-full max-w-lg text-center transform scale-100 transition-all">
             <h2 className="text-4xl font-black text-yellow-400 mb-2 uppercase tracking-widest">Game Over!</h2>
             <p className="text-slate-300 mb-6 text-lg">The 5 rounds have completed.</p>
             
             <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-slate-700 shadow-inner">
               <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">Winner</div>
               <div className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                 <span>🏆</span> 
                 {gameOver.winner.name} 
                 <span className="text-green-400 ml-2">({gameOver.winner.points} pts)</span>
               </div>
             </div>

             <button 
               onClick={handleReturnToLobby}
               className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-900 font-black rounded-xl text-lg uppercase tracking-widest transition-all shadow-lg"
             >
               Play Again
             </button>
           </div>
         </div>
      )}

      {showModal && isDrawer && (
        <WordSelectionModal choices={choices} onSelect={handleWordSelect} />
      )}

      {/* Left Sidebar */}
      <div className="w-1/5 bg-slate-800 p-4 border-r border-slate-700 shadow-xl flex flex-col">
        {/* Timer UI inside the left sidebar top */}
        <div className="bg-slate-900 p-4 rounded-xl shadow-inner mb-4 flex flex-col items-center border border-slate-700">
           <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Time Left</div>
           <div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
             {timeLeft}s
           </div>
        </div>
        <PlayerList players={gameState.players} />
      </div>

      {/* Center Area */}
      <div className="flex-grow h-full bg-slate-200 flex flex-col items-center overflow-hidden">
        
        <div className="w-full bg-slate-800 h-20 flex items-center justify-between px-8 shadow-lg border-b-4 border-yellow-400 z-10">
          <div className="text-yellow-400 font-bold uppercase tracking-widest text-sm flex flex-col items-center bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
            <span className="text-slate-400 text-xs">Round</span>
            <span className="text-xl">{currentRound}/5</span>
          </div>
          <WordHint word={gameState.wordHint || (isDrawer ? "CHOOSE A WORD!" : "WAITING FOR DRAWER...")} />
          <div className="w-20"></div> {/* Spacer for centering flex output */}
        </div>

        <div className="flex-grow flex flex-col items-center justify-center w-full p-4 relative">
          <div className="bg-white rounded-lg shadow-2xl p-2 z-0">
             <Canvas isDrawer={isDrawer} roomId={roomId} color={selectedColor} />
          </div>

          {isDrawer && (
            <div className="mt-4 p-3 bg-slate-800 rounded-2xl shadow-xl flex flex-col items-center gap-2 border-2 border-slate-600 z-10">
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                      selectedColor === color ? 'border-yellow-400 scale-110' : 'border-slate-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-yellow-400 font-bold text-xs uppercase animate-pulse">
                Your Turn to Draw!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 h-full flex flex-col bg-slate-800 border-l border-slate-700">
        <div className="p-4 bg-slate-900 border-b border-slate-700 flex flex-col gap-2">
          <h2 className="font-bold text-yellow-400 uppercase tracking-widest text-center">Room: <span className="text-white">{roomId}</span></h2>
          <button
            onClick={() => {
              const inviteLink = `${window.location.origin}/?room=${roomId}`;
              navigator.clipboard.writeText(inviteLink);
              // Simple temporary UI feedback
              const btn = document.getElementById('invite-btn');
              if (btn) {
                const originalText = btn.innerText;
                btn.innerText = "COPIED!";
                btn.classList.add("bg-green-500", "text-white");
                btn.classList.remove("bg-slate-700", "text-slate-300");
                setTimeout(() => {
                  btn.innerText = originalText;
                  btn.classList.remove("bg-green-500", "text-white");
                  btn.classList.add("bg-slate-700", "text-slate-300");
                }, 2000);
              }
            }}
            id="invite-btn"
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-600 flex items-center justify-center gap-2"
          >
            📋 Copy Invite Link
          </button>
        </div>
        <ChatBox />
      </div>
    </div>
  );
};

export default GameRoom;