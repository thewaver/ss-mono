import lofiHipHop from "../../lofi_hiphop_10s.mp3";
import synthwave from "../../synthwave_10s.mp3";

export const TRACKS = [
    { name: "Lo-fi hip hop", src: lofiHipHop },
    { name: "Synthwave", src: synthwave },
];

export const TRACK_NAMES = TRACKS.map((track) => track.name);

export const PERCENT = 100;
export const FIELD_WIDTH = 130;
