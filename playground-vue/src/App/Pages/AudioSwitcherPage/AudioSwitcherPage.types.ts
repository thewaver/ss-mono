export type AudioSwitcherExampleProps = {
    "src": string;
    "crossfadeMs": number;
    "volume": number;
    "playback": boolean;
    "onUpdate:playback"?: (isPlaying: boolean) => void;
};
