import lofiHipHop from "../../lofi_hiphop_10s.mp3";
import synthwave from "../../synthwave_10s.mp3";

export const TRACKS = [
    { name: "lo_fi_hip_hop", src: lofiHipHop },
    { name: "synthwave", src: synthwave },
];

export const TRACK_NAMES = TRACKS.map((track) => track.name);

export const PERCENT = 100;
export const FIELD_WIDTH = 130;
