import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (name.trim() && roomId.trim()) {
      // Pass the name via React Router state
      navigate(`/room/${roomId.trim()}`, { state: { name: name.trim() } });
    }
  };

  const createRandomRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(randomId);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 font-sans p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Header Area */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-md relative z-10">
            Scribble
          </h1>
          <p className="text-orange-100 mt-2 font-medium tracking-wide relative z-10">
            Draw, Guess, Win!
          </p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <form onSubmit={handleJoin} className="space-y-6">
            
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Your Nickname
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter a fun name..."
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-inner"
              />
            </div>

            {/* Room Input */}
            <div>
              <label htmlFor="room" className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Room ID
              </label>
              <div className="flex gap-2">
                <input
                  id="room"
                  type="text"
                  placeholder="e.g. FUNROOM"
                  required
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-inner uppercase"
                />
                <button
                  type="button"
                  onClick={createRandomRoom}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors font-semibold border border-slate-600 flex items-center justify-center"
                  title="Generate Random Room"
                >
                  🎲
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-900 font-black rounded-xl text-lg uppercase tracking-widest transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(250,204,21,0.3)] focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
            >
              Play Now
            </button>
            
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Home;