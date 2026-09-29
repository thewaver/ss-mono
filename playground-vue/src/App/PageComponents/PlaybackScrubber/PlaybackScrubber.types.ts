export type PagePlaybackScrubberProps = {
    "id": string;
    "ariaLabel": string;
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    "progress": number;
    "onUpdate:progress"?: (progress: number) => void;
};
