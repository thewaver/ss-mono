export const EXAMPLE_NAMES = {
    determinate: "Determinate",
    indeterminate: "Indeterminate",
    liveRange: "Live range",
    outOfRange: "Out of range",
    errored: "Error",
    diskMeter: "Disk usage, as a meter",
    ring: "Drawn as a ring",
    fillingContainer: "Filling its container",
};

export const UPLOAD_TOTAL_BYTES = 2_400_000;

export const UPLOAD_TICK_MS = 50;

export const UPLOAD_TICK_BYTES = 24_000;

export const EXAMPLES_ROOT = "/src/App/Pages/ProgressPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/ProgressPage/Docs";

export const BYTES_PER_KB = 1000;

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content: "Inside a box whose text runs right to left, the bar fills from the right.",
    },
    standingUpright: {
        title: "Standing upright",
        content:
            "Which way the bar runs is the painter's to decide: this one stands upright and fills from the bottom, and nothing about the component changes.",
    },
    workUnknownLength: {
        title: "Work of unknown length",
        content:
            "Leave [prop]value[/prop] out and the bar is indeterminate. A screen reader hears no number, and the painter is handed no ratio, so it can animate instead.",
    },
    countingRealUnits: {
        title: "Counting in real units",
        content:
            "Set [prop]min[/prop] and [prop]max[/prop] to the units the work is counted in, bytes here, and pass the count straight in; the painter is still handed a ratio from 0 to 1. Where the bare number would mean nothing to a listener, [prop]ariaValueText[/prop] says what to read out instead, shown here under the bar.",
    },
    valuePastEitherEnd: {
        title: "A value past either end",
        content:
            "A value outside [prop]min[/prop] and [prop]max[/prop] is clamped, so the bar is drawn full rather than past its end, and the ratio the painter is handed never leaves 0 to 1. This one is handed 5 against the default range of 0 to 1.",
    },
    readingRatherThanTask: {
        title: "A reading rather than a task",
        content:
            "Set [prop]role[/prop] to meter for a reading of how full something is, disk space here, rather than work that will finish. A screen reader hears it as a gauge, and since a gauge always reads something, [prop]value[/prop] is then required.",
    },
    drawnRing: {
        title: "Drawn as a ring",
        content:
            "What the progress looks like is the painter's to decide: here the same upload is drawn round a circle, and nothing about the component changes.",
    },
};

export const RETICULATING_SPLINES_LABEL = "Reticulating splines";

export const UPLOAD_DRAWN_RING_LABEL = "Upload, drawn as a ring";
