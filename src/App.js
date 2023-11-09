import React, { useEffect, useState } from 'react';
import './App.css';

function Soundboard() {
  const [soundFiles, setSoundFiles] = useState([]);

  useEffect(() => {
    const importAll = (context) => context.keys().map(context);
    const soundFilesContext = require.context('./sounds', false, /\.(mp3)$/);
    const files = importAll(soundFilesContext).map((sound) => {
      const fileName = sound.replace('./', ''); // Remove the './' prefix from the file name
      const audio = new Audio(sound);
      audio.addEventListener('ended', () => handleAudioEnded(audio));
      return {
        name: fileName,
        path: sound,
        audio: audio,
        isPlaying: false,
      };
    });
    setSoundFiles(files);
  }, []);

  const togglePlayPause = (index) => {
    const updatedSoundFiles = [...soundFiles];
    const sound = updatedSoundFiles[index];

    if (sound.isPlaying) {
      sound.audio.pause();
    } else {
      sound.audio.play();
    }

    sound.isPlaying = !sound.isPlaying;
    setSoundFiles(updatedSoundFiles);
  };

  const stopSound = (index) => {
    const updatedSoundFiles = [...soundFiles];
    updatedSoundFiles[index].audio.pause();
    updatedSoundFiles[index].audio.currentTime = 0; // Reset audio playback position to the beginning
    updatedSoundFiles[index].isPlaying = false;
    setSoundFiles(updatedSoundFiles);
  };

  const handleAudioEnded = (audio) => {
    const index = soundFiles.findIndex((sound) => sound.audio === audio);
    if (index !== -1) {
      const updatedSoundFiles = [...soundFiles];
      updatedSoundFiles[index].isPlaying = false;
      setSoundFiles(updatedSoundFiles);
    }
  };

  return (
    <div className="soundboard">
      {soundFiles.map((sound, index) => (
        <div key={index} className="sound-item">
          <button onClick={() => togglePlayPause(index)}>
            {sound.isPlaying ? '⏸️' : '▶️'} {sound.name}
          </button>
          <button onClick={() => stopSound(index)}>⏹️</button>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>Stylish Soundboard</h1>
      <Soundboard />
    </div>
  );
}

export default App;
