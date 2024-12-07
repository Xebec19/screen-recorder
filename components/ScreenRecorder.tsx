"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download, Pause, Play } from "lucide-react";

export default function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    recordedChunks.current = [];
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());

        if (recordedChunks.current.length) {
          const blob = new Blob(recordedChunks.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
        } else {
          setError(
            "No data was recorded. The recording may have been too short."
          );
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setError(
            "Permission to record screen was denied. Please allow access and try again."
          );
        } else if (error.name === "NotReadableError") {
          setError(
            "Unable to capture your screen. Please make sure no other application is using your screen."
          );
        } else if (error.name === "NotFoundError") {
          setError(
            "No video or audio source found. Please make sure your device has a screen to capture."
          );
        } else {
          setError(`An error occurred: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }, []);

  const downloadVideo = useCallback(() => {
    if (videoURL) {
      const a = document.createElement("a");
      a.href = videoURL;
      const timestamp = new Date().getTime().toString();
      a.download = `screen-recording-${timestamp}.webm`;
      a.click();
    }
  }, [videoURL]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="space-x-4">
        <Button onClick={startRecording} disabled={isRecording}>
          <Play className="size-4 mr-1" />
          Start Recording
        </Button>
        <Button onClick={stopRecording} disabled={!isRecording}>
          <Pause className="size-4 mr-1" />
          Stop Recording
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {videoURL && (
        <div className="mt-4 space-y-4 flex-col flex items-end">
          <Button onClick={downloadVideo} className="w-[11rem]">
            <Download className="size-4 mr-1" />
            Download Recording
          </Button>
          {/* <AspectRatio ratio={16 / 9} className="bg-muted"> */}
          <video
            src={videoURL}
            controls
            className="aspect-video rounded-md object-cover"
          />
          {/* </AspectRatio> */}
        </div>
      )}
    </div>
  );
}
