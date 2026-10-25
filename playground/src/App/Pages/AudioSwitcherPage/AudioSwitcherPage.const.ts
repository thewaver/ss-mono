import lofiHipHop from "../../lofi_hiphop_10s.mp3";
import synthwave from "../../synthwave_10s.mp3";

export const TRACKS = [
    { name: "lo_fi_hip_hop", src: lofiHipHop },
    { name: "synthwave", src: synthwave },
];

export const TRACK_NAMES = TRACKS.map((track) => track.name);

export const PERCENT = 100;
export const FIELD_WIDTH = 150;

export const EXAMPLE_NAMES = {
    default: "Crossfading between two loops",
};

export const EXAMPLES_ROOT = "/src/App/Pages/AudioSwitcherPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/AudioSwitcherPage/Docs";
