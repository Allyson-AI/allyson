import { useState, useEffect } from "react";

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorder.ondataavailable = (event) => {
        console.log(event.data)
        if (event.data.size > 0) {
          setAudioChunks(event.data);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Process recorded audio when stopping
  useEffect(() => {
    if (!mediaRecorder) return;

    const handleStop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      console.log(url)
      setAudioChunks([]);
    };

    mediaRecorder.addEventListener('stop', handleStop);

    return () => {
      mediaRecorder.removeEventListener('stop', handleStop);
    };
  }, [mediaRecorder, audioChunks]);

  return { isRecording, startRecording, stopRecording, audioUrl };
};

export default useAudioRecorder;
