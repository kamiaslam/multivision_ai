'use client';

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause } from 'react-icons/fa';

let activeWavesurfer: WaveSurfer | null = null;
let activeSetIsPlaying: React.Dispatch<React.SetStateAction<boolean>> | null = null;

interface AudioPlayerProps {
  audio: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audio }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#7DD3FC',
      progressColor: '#38BDF8',
      cursorColor: 'transparent',
      barWidth: 6,
      barRadius: 6,
      height: 100,
      normalize: true,
    });

    wavesurfer.current.load(audio);

    wavesurfer.current.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audio]);

  const togglePlay = () => {
    if (!wavesurfer.current) return;

    // Pause previous player and update its state
    if (activeWavesurfer && activeWavesurfer !== wavesurfer.current) {
      activeWavesurfer.pause();
      if (activeSetIsPlaying) activeSetIsPlaying(false);
    }

    wavesurfer.current.playPause();
    setIsPlaying((prev) => !prev);

    // Update active references
    activeWavesurfer = wavesurfer.current;
    activeSetIsPlaying = setIsPlaying;
  };

  return (
    <div className="flex items-center gap-4 rounded-lg w-full max-w-[600px]">
      <button
        onClick={togglePlay}
        className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-300 text-black hover:bg-sky-400 transition"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <div
        ref={waveformRef}
        className="flex-1"
        style={{ overflow: 'hidden' }}
      />
    </div>
  );
};

export default AudioPlayer;
