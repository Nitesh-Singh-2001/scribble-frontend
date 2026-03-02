import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric'; 
import { socket } from '../services/socket';

const Canvas = ({ isDrawer, roomId, color = "black" }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  
  // Track if canvas is initialized to prevent duplicate initialization
  const isInitialized = useRef(false);

  // 1. Initialize canvas ONCE
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false, // Default to false, toggle later
      width: 600,
      height: 500,
      backgroundColor: 'white',
    });
    
    // Setup brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = color;
    
    fabricRef.current = canvas;

    // Listen for local drawing
    canvas.on('path:created', (e) => {
      // Only emit if we are actually allowed to draw
      if (canvas.isDrawingMode) {
        const pathData = e.path.toObject();
        socket.emit("send_drawing", { roomId, path: pathData });
      }
    });

    // Listeners for remote events
    const onReceiveDrawing = async (data) => {
      if (fabricRef.current?.isDrawingMode) return; // Don't draw over our own strokes while drawing
      const objects = await fabric.util.enlivenObjects([data.path]);
      objects.forEach((obj) => fabricRef.current.add(obj));
      fabricRef.current.renderAll();
    };

    const onLoadHistory = async (historyData) => {
      if (!historyData || historyData.length === 0) return;
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = 'white';
      
      const objects = await fabric.util.enlivenObjects(historyData);
      objects.forEach((obj) => fabricRef.current.add(obj));
      fabricRef.current.renderAll();
    };

    const onClearCanvas = () => {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = 'white';
      fabricRef.current.renderAll();
    };

    socket.on("receive_drawing", onReceiveDrawing);
    socket.on("load_history", onLoadHistory);
    socket.on("clear_canvas", onClearCanvas);

    return () => {
      socket.off("receive_drawing", onReceiveDrawing);
      socket.off("load_history", onLoadHistory);
      socket.off("clear_canvas", onClearCanvas);
      canvas.dispose();
      isInitialized.current = false;
    };
  }, [roomId]); // Only re-run if we join a totally different room

  // 2. Toggle drawing mode when isDrawer changes
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = isDrawer;
    }
  }, [isDrawer]);

  // 3. Update brush color when the prop changes
  useEffect(() => {
    if (fabricRef.current && fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.color = color;
    }
  }, [color]);

  const handleClear = () => {
    if (!isDrawer) return;
    socket.emit("clear_canvas", roomId);
  };

  return (
    <div className="relative border-4 border-slate-300 rounded-lg shadow-inner bg-white">
      <canvas ref={canvasRef} />
      {isDrawer && (
        <button 
          onClick={handleClear}
          className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-lg font-bold shadow-md cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default Canvas;