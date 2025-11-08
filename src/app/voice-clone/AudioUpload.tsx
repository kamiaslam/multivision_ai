import { useState, useRef, useEffect } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { FormData } from "./types";

// Utility function to get audio duration from File (for uploaded files only)
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      // Check if duration is valid (not Infinity or NaN)
      if (isFinite(audio.duration) && audio.duration > 0) {
        resolve(audio.duration);
      } else {
        console.log('Invalid duration detected for uploaded file:', audio.duration);
        reject(new Error('Invalid audio duration'));
      }
    });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio file'));
    });
    
    // Set a timeout to handle cases where loadedmetadata doesn't fire
    setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error('Timeout loading audio metadata'));
    }, 3000);
    
    audio.src = url;
  });
};


interface AudioUploadProps {
  formData: FormData;
  setFormData: (updater: React.SetStateAction<FormData>) => void;
}

const AudioUpload = ({ formData, setFormData }: AudioUploadProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [isValidDuration, setIsValidDuration] = useState<boolean | null>(null);
  const [isRecordedAudio, setIsRecordedAudio] = useState<boolean>(false);
  const [recordedDuration, setRecordedDuration] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], `${formData.name || 'voice'}.wav`, { type: 'audio/wav' });
        
        // Calculate exact duration using start time
        const endTime = Date.now();
        const startTime = recordingStartTimeRef.current || endTime;
        const exactDuration = Math.floor((endTime - startTime) / 1000);
        
        console.log('Recording timing - Start:', startTime, 'End:', endTime, 'Duration:', exactDuration, 'State duration:', recordingTime);
        
        // Use the exact calculated duration
        setIsRecordedAudio(true);
        setRecordedDuration(exactDuration);
        setAudioDuration(exactDuration);
        setIsValidDuration(exactDuration >= 10);
        
        // Store the file with a special property to identify it as recorded
        const recordedFile = Object.assign(file, { isRecorded: true, recordedDuration: exactDuration });
        setFormData(prev => ({ ...prev, audio_file: recordedFile }));
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        console.log('Recorded audio - Exact duration:', exactDuration, 'Valid:', exactDuration >= 10);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Capture the exact start time
      recordingStartTimeRef.current = Date.now();
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mark this as uploaded audio (not recorded)
      setIsRecordedAudio(false);
      setRecordedDuration(null);
      
      // Store the file with a special property to identify it as uploaded
      const uploadedFile = Object.assign(file, { isRecorded: false });
      setFormData(prev => ({ ...prev, audio_file: uploadedFile }));
      
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // Check duration for uploaded file
      try {
        const duration = await getAudioDuration(file);
        console.log('Uploaded audio - Duration:', duration, 'Is valid:', duration >= 10);
        setAudioDuration(duration);
        setIsValidDuration(duration >= 10);
      } catch (error) {
        console.error('Error getting audio duration:', error);
        setAudioDuration(null);
        setIsValidDuration(false);
      }
    }
  };

  const clearAudio = () => {
    setFormData(prev => ({ ...prev, audio_file: null }));
    setAudioUrl(null);
    setAudioDuration(null);
    setIsValidDuration(null);
    setIsRecordedAudio(false);
    setRecordedDuration(null);
    recordingStartTimeRef.current = null;
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    // Handle invalid durations
    if (!isFinite(seconds) || seconds < 0) {
      return '00:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-t-primary mb-4">Audio Sample</h3>
        <p className="text-sm text-t-secondary mb-6">
          Upload an audio file or record a sample to create your voice clone. The audio should be clear and contain speech in the selected language.
        </p>
      </div>

      <div className="space-y-4">
        {!formData.audio_file ? (
          <div className="space-y-4">
            {/* Recording Animation and Timer */}
            {isRecording && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <div className="text-red-700 font-mono text-lg font-semibold">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-red-600 text-sm">Recording...</div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-red-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      recordingTime >= 10 
                        ? 'bg-green-500' 
                        : recordingTime >= 7 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((recordingTime / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                
                {/* Progress Text */}
                <div className="mt-2 text-center">
                  <span className={`text-sm font-medium ${
                    recordingTime >= 10 
                      ? 'text-green-700' 
                      : recordingTime >= 7 
                        ? 'text-yellow-700' 
                        : 'text-red-700'
                  }`}>
                    {recordingTime >= 10 
                      ? '✓ Minimum duration reached!' 
                      : recordingTime >= 7 
                        ? `Almost there! ${10 - recordingTime}s more needed` 
                        : `${10 - recordingTime}s more needed for minimum duration`
                    }
                  </span>
                </div>
              </div>
            )}
            

            {/* Record Button */}
            <Button
              isBlack
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full gap-2 ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Icon 
                name={isRecording ? "stop" : "microphone"} 
                className="w-4 h-4" 
              />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            
            <div className="text-center text-t-tertiary text-sm">or</div>
            
            {/* Upload Button */}
            <Button
              isStroke
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
            >
              <Icon name="upload" className="w-4 h-4" />
              Upload Audio File
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Modern Audio Player */}
            <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
              isValidDuration === false 
                ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
                : isValidDuration === true 
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                  : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
            } shadow-lg`}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isValidDuration === false 
                      ? 'bg-red-100' 
                      : isValidDuration === true 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                  }`}>
                    <Icon 
                      name="volume_1" 
                      className={`w-5 h-5 ${
                        isValidDuration === false 
                          ? 'text-red-600' 
                          : isValidDuration === true 
                            ? 'text-green-600' 
                            : 'text-blue-600'
                      }`} 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Audio Sample</h4>
                    <p className="text-xs text-gray-500">Voice recording</p>
                  </div>
                </div>
                {audioDuration !== null && (
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    isValidDuration === false 
                      ? 'bg-red-200 text-red-800' 
                      : isValidDuration === true 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-gray-200 text-gray-800'
                  }`}>
                    {formatTime(audioDuration)}
                  </div>
                )}
              </div>
              
              {/* Audio Controls */}
              {audioUrl && (
                <div className="px-4 pb-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <audio controls className="w-full h-10">
                      <source src={audioUrl} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}
              
              {/* Status Message */}
              {audioDuration !== null && (
                <div className={`px-4 pb-4 ${
                  isValidDuration === false 
                    ? 'bg-red-50 border-t border-red-100' 
                    : isValidDuration === true 
                      ? 'bg-green-50 border-t border-green-100' 
                      : 'bg-gray-50 border-t border-gray-100'
                }`}>
                  <div className={`flex items-center gap-2 py-2 text-sm font-medium ${
                    isValidDuration === false 
                      ? 'text-red-700' 
                      : isValidDuration === true 
                        ? 'text-green-700' 
                        : 'text-gray-700'
                  }`}>
                    {isValidDuration === false ? (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Audio must be at least 10 seconds long</span>
                      </>
                    ) : isValidDuration === true ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Audio duration meets requirements</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>Duration: {formatTime(audioDuration)}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modern Clear Button */}
            <Button
              onClick={clearAudio}
              className="w-full gap-2 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium"
            >
              <Icon name="trash" className="w-4 h-4" />
              Clear Audio
            </Button>
          </div>
        )}

        {/* Modern Audio Requirements */}
        <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
          isValidDuration === false 
            ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
        } shadow-lg`}>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                isValidDuration === false 
                  ? 'bg-red-100' 
                  : 'bg-blue-100'
              }`}>
                <Icon 
                  name={isValidDuration === false ? "warning" : "info"} 
                  className={`w-5 h-5 ${
                    isValidDuration === false 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                  }`} 
                />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${
                  isValidDuration === false 
                    ? 'text-red-900' 
                    : 'text-blue-900'
                }`}>
                  Audio Requirements
                </h4>
                <p className={`text-xs ${
                  isValidDuration === false 
                    ? 'text-red-600' 
                    : 'text-blue-600'
                }`}>
                  Quality guidelines for voice cloning
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isValidDuration === false 
                  ? 'bg-red-100 border border-red-200' 
                  : 'bg-blue-100 border border-blue-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isValidDuration === false 
                      ? 'bg-red-500' 
                      : 'bg-blue-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    isValidDuration === false 
                      ? 'text-red-800' 
                      : 'text-blue-800'
                  }`}>
                    Minimum 10 seconds of clear speech
                  </span>
                </div>
                {audioDuration !== null && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isValidDuration === false 
                      ? 'bg-red-200 text-red-800' 
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    Current: {formatTime(audioDuration)}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Supported formats: WAV, MP3, M4A</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Good quality recording with minimal background noise</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Speak naturally in the selected language</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioUpload;
