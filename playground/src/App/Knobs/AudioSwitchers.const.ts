export namespace AudioSwitcherKnobs {
    export const MIN_CROSSFADE_MS = 0;
    export const MAX_CROSSFADE_MS = 4000;
    export const CROSSFADE_STEP_MS = 250;
    export const MIN_VOLUME_PERCENT = 0;
    export const MAX_VOLUME_PERCENT = 100;
    export const VOLUME_STEP_PERCENT = 5;

    export const STARTING_CROSSFADE_MS = 1000;

    export const TRACK_TEXT = {
        label: "Track",
        hint: "Which piece is playing. Changing it while it plays is what the switcher crossfades.",
        controls: "Picks the example track sent to AudioSwitcherProps.src",
    };

    export const CROSSFADE_MS_TEXT = {
        label: "Crossfade (ms)",
        hint: "How long the old track takes to fade out while the new one fades in.",
        controls: "Sets AudioSwitcherProps.crossfadeMs",
    };

    export const VOLUME_TEXT = {
        label: "Volume (%)",
        hint: "How loud the playback is, apart from the system's own volume.",
        controls: "Sets AudioSwitcherProps.volume, sent as a share of 1",
    };
}
