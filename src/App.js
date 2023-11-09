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
    return () => {
      soundFiles.forEach((sound) => {
        sound.audio.removeEventListener('ended', () => handleAudioEnded(sound.audio));
      });
    };
  }, []);

  const togglePlayPause = (index) => {
    const updatedSoundFiles = [...soundFiles];
    const sound = updatedSoundFiles[index];
  
    if (sound.isPlaying) {
      sound.audio.pause();
      // sound.audio.currentTime = 0; // Reset playback position to the beginning
      updatedSoundFiles[index].isPlaying = false;
      document.getElementById(`soundButton${index}`).classList.remove('playing');
    } else {
      sound.audio.play();
      updatedSoundFiles[index].isPlaying = true;
      document.getElementById(`soundButton${index}`).classList.add('playing');
    }
  
    setSoundFiles(updatedSoundFiles);
  };
  
  const stopSound = (index) => {
    const updatedSoundFiles = [...soundFiles];
    updatedSoundFiles[index].audio.pause();
    updatedSoundFiles[index].audio.currentTime = 0; // Reset playback position to the beginning
    updatedSoundFiles[index].isPlaying = false;
    document.getElementById(`soundButton${index}`).classList.add('stopped');
    setSoundFiles(updatedSoundFiles);
  
    // Remove the 'stopped' class after 1 second
    setTimeout(() => {
      document.getElementById(`soundButton${index}`).classList.remove('stopped');
      document.getElementById(`soundButton${index}`).classList.remove('playing');
    }, 1000);
  };

  const handleAudioEnded = (audio) => {
    setSoundFiles(prevSoundFiles => {
      const updatedSoundFiles = prevSoundFiles.map((sound) => {
        if (sound.audio === audio) {
          return { ...sound, isPlaying: false };
        }
        return sound;
      });
      return updatedSoundFiles;
    });
  };
  
  return (
    <div className="soundboard">
      {soundFiles.map((sound, index) => (
        <div key={index} className="sound-item">
          <button id={`soundButton${index}`} onClick={() => togglePlayPause(index)}>
            {sound.isPlaying ? '⏸️' : '▶️'} {sound.name.replace('/static/media/', '').split('.')[0]}.mp3
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
