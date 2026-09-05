import lofiHipHop from "../../lofi_hiphop_10s.mp3";
import synthwave from "../../synthwave_10s.mp3";

export const TRACKS = [
    { name: "Lo-fi hip hop", src: lofiHipHop },
    { name: "Synthwave", src: synthwave },
];

export const TRACK_NAMES = TRACKS.map((track) => track.name);

export const MIN_CROSSFADE_MS = 0;
export const MAX_CROSSFADE_MS = 4000;
export const CROSSFADE_STEP_MS = 250;
export const MIN_VOLUME_PERCENT = 0;
export const MAX_VOLUME_PERCENT = 100;
export const VOLUME_STEP_PERCENT = 5;
export const PERCENT = 100;
export const FIELD_WIDTH = 130;

export const STARTING_CROSSFADE_MS = 1000;
export const STARTING_VOLUME_PERCENT = 50;
