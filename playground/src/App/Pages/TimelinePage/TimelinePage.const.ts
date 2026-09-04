import type { TimelineSpan } from "@thewaver/ss-components";

import type { Clip, Meeting } from "./TimelinePage.types";

const MINUTES_PER_HOUR = 60;
const TENS = 10;

const at = (hour: number, minute = 0) => hour * MINUTES_PER_HOUR + minute;

export const DAY: TimelineSpan = { start: at(8), end: at(19) };

export const MINUTE_STEPS = [5, 15, 30, at(1), at(2), at(4)];

export const MEETINGS: Meeting[] = [
    { name: "Standup", room: "Kitchen", from: at(9), to: at(9, 15) },
    { name: "Design review", room: "Blue room", from: at(9, 30), to: at(11) },
    { name: "Interview", room: "Booth 2", from: at(10), to: at(11) },
    { name: "Vendor call", room: "Booth 1", from: at(10, 30), to: at(11, 15) },
    { name: "Lunch", room: "Out", from: at(12), to: at(13) },
    { name: "Pairing", room: "Desk", from: at(13), to: at(15, 30) },
    { name: "All hands", room: "Hall", from: at(14), to: at(15) },
    { name: "Retro", room: "Blue room", from: at(15, 30), to: at(16, 30) },
    { name: "Budget", room: "Blue room", from: at(16), to: at(17), isCancelled: true },
    { name: "Handover", room: "Desk", from: at(17, 30), to: at(18) },
];

export const REEL: TimelineSpan = { start: 0, end: 180 };

export const SECOND_STEPS = [1, 5, 15, 30, 60];

export const TRACKS = ["Video", "Audio", "Titles"];

export const CLIPS: Clip[] = [
    { name: "Cold open", track: 0, from: 0, to: 22 },
    { name: "Interview", track: 0, from: 22, to: 96 },
    { name: "B roll", track: 0, from: 96, to: 148 },
    { name: "Sign off", track: 0, from: 148, to: 180 },
    { name: "Theme", track: 1, from: 0, to: 30 },
    { name: "Room tone", track: 1, from: 30, to: 150 },
    { name: "Outro", track: 1, from: 150, to: 180 },
    { name: "Title card", track: 2, from: 4, to: 14 },
    { name: "Lower third", track: 2, from: 28, to: 40 },
    { name: "Credits", track: 2, from: 160, to: 178 },
];

export const formatClock = (minutes: number) => {
    const hour = Math.floor(minutes / MINUTES_PER_HOUR);
    const minute = Math.round(minutes - hour * MINUTES_PER_HOUR);

    return `${hour}:${minute < TENS ? "0" : ""}${minute}`;
};

export const formatStopwatch = (seconds: number) => {
    const minute = Math.floor(seconds / MINUTES_PER_HOUR);
    const second = Math.round(seconds - minute * MINUTES_PER_HOUR);

    return `${minute}:${second < TENS ? "0" : ""}${second}`;
};
