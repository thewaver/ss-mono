export type AudioSwitcherExampleProps = {
    src: string;
    crossfadeMs: number;
    volume: number;
    playback: readonly [boolean, (isPlaying: boolean) => void];
};
