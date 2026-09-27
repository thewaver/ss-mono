export type AudioSwitcherExampleProps = {
    src: string;
    crossfadeMs: number;
    volume: number;
    playbackState: readonly [boolean, (isPlaying: boolean) => void];
};
