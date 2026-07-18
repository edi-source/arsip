/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Pen, Trash2, ShieldCheck, Award } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (signatureDataUrl: string) => void;
  onSelectStamp: () => void;
  currentValue?: string;
  onCancel?: () => void;
}

export default function SignatureCanvas({
  onSave,
  onSelectStamp,
  currentValue,
  onCancel,
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas and set default stroke settings
    ctx.strokeStyle = '#1e293b'; // Slate 800
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // If it's a touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    
    // If it's a mouse event
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveDrawn = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    
    const dataUrl = canvas.toDataUrl('image/png');
    onSave(dataUrl);
  };

  return (
    <div id="signature-canvas-container" className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-sm max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Pen className="w-4 h-4 text-amber-600" />
          Pengesahan Tanda Tangan Digital
        </h4>
        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
          KEPSEK AUTH
        </span>
      </div>

      {/* Selector Options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          id="btn-use-stamp"
          type="button"
          onClick={onSelectStamp}
          className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 rounded-lg transition-all text-center group cursor-pointer"
        >
          <Award className="w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-amber-900 mt-1">Stempel Resmi</span>
          <span className="text-[9px] text-amber-700 font-mono mt-0.5">Dual-Stempel Emas</span>
        </button>

        <div className="flex flex-col items-center justify-center p-3 border-2 border-slate-200 bg-white rounded-lg text-center">
          <ShieldCheck className="w-8 h-8 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700 mt-1">Goresan Pointer</span>
          <span className="text-[9px] text-slate-500 font-mono mt-0.5">Mouse / Touchpad</span>
        </div>
      </div>

      <div className="relative border-2 border-slate-300 rounded bg-white overflow-hidden mb-4">
        {/* Draw Indicator Guide */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-slate-400 text-xs text-center p-4">
            Goreskan tanda tangan Anda di area kosong ini...
          </div>
        )}
        <canvas
          id="signature-pad"
          ref={canvasRef}
          width={400}
          height={180}
          className="w-full h-[180px] block cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-clear-sig"
          type="button"
          onClick={clearCanvas}
          disabled={!hasDrawn}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:pointer-events-none rounded transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Bersihkan
        </button>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              id="btn-cancel-sig"
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded transition-all cursor-pointer"
            >
              Batal
            </button>
          )}

          <button
            id="btn-save-sig"
            type="button"
            onClick={handleSaveDrawn}
            disabled={!hasDrawn}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:pointer-events-none rounded shadow-sm transition-all cursor-pointer"
          >
            Terapkan Goresan
          </button>
        </div>
      </div>
    </div>
  );
}
