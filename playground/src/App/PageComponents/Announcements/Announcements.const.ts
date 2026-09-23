import type {
    CarouselStep,
    CarrierAnnouncements,
    ColorAreaAxis,
    CuboidFace,
    DateInputPart,
    FlipCardFace,
    PaginatorStep,
    PatchBoardAnnouncements,
    SortableAnnouncements,
    SortableGridAnnouncements,
    TableAnnouncements,
} from "@thewaver/ss-components";
import type { TimeValueUnit } from "@thewaver/ss-utils";

const SINGLE = 1;

const startSentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const computePositionLabel = (index: number, count: number) => `${index + 1} of ${count}`;

const CARRIER_ANNOUNCEMENTS: CarrierAnnouncements = {
    computePickedUp: (itemLabel, zoneLabel) => `${itemLabel} picked up from ${zoneLabel}.`,
    computePickedUpByKey: (itemLabel, zoneLabel, placeLabel, keyHint) =>
        `${itemLabel} picked up from ${zoneLabel}, ${placeLabel}. ${keyHint}`,
    computeAimed: (placeLabel, zoneLabel) => `${startSentence(placeLabel)} in ${zoneLabel}.`,
    computeZoneEntered: (zoneLabel, placeLabel) => `${zoneLabel}, ${placeLabel}.`,
    computeReturned: (itemLabel, zoneLabel) => `${itemLabel} returned to ${zoneLabel}.`,
    computeLeftInPlace: (itemLabel) => `${itemLabel} left where it was.`,
    computeRefused: (itemLabel, toZoneLabel, fromZoneLabel) =>
        `${itemLabel} does not fit in ${toZoneLabel}, returned to ${fromZoneLabel}.`,
    computeDropped: (itemLabel, zoneLabel, placeLabel) => `${itemLabel} dropped in ${zoneLabel}, ${placeLabel}.`,
};

export const SORTABLE_ANNOUNCEMENTS: SortableAnnouncements = {
    ...CARRIER_ANNOUNCEMENTS,
    restingKeyHint: "Press Enter to pick this up and move it.",
    keyHint: "Arrow keys choose a place, Enter drops, Escape cancels.",
    keyHintAcrossZones: "Arrow keys choose a place, Tab changes list, Enter drops, Escape cancels.",
    computePlaceLabel: (index, count) => `place ${index + 1} of ${count}`,
};

export const TABLE_ANNOUNCEMENTS: TableAnnouncements = {
    ...CARRIER_ANNOUNCEMENTS,
    restingKeyHint: "Press Enter to pick this column up and move it.",
    keyHint: "Enter drops, Escape cancels.",
    computePlaceLabel: (index, count) => `column ${index + 1} of ${count}`,
    computeColumnMoved: (header, index, count) => `${header} moved to column ${index + 1} of ${count}.`,
};

export const SORTABLE_GRID_ANNOUNCEMENTS: SortableGridAnnouncements = {
    ...CARRIER_ANNOUNCEMENTS,
    restingKeyHint: "Press Enter to pick this up and move it.",
    keyHint: "Arrow keys move it, Enter drops, Escape cancels.",
    keyHintAcrossZones: "Arrow keys move it, Tab changes grid, Enter drops, Escape cancels.",
    computePlaceLabel: (spot, hasRoom) => `column ${spot.col + 1}, row ${spot.row + 1}${hasRoom ? "" : ", no room"}`,
};

export const PATCH_BOARD_ANNOUNCEMENTS: PatchBoardAnnouncements = {
    ...CARRIER_ANNOUNCEMENTS,
    nodeRestingKeyHint: "Press Enter to pick this up and move it.",
    socketRestingKeyHint: "Press Enter to pick a cable up from this socket.",
    nodeKeyHint: "Arrow keys move it, Enter drops, Escape cancels.",
    plugKeyHint: "Arrow keys choose a socket, Enter connects, Escape cancels.",
    computeRegionLabel: (region) => `${region.vertical} ${region.horizontal}`,
    offBoardPlaceLabel: "off the board",
    noSocketPlaceLabel: "no socket",
    computeSocketPlaceLabel: (endLabel, isRefused) => `${endLabel}${isRefused ? ", cannot connect" : ""}`,
    computeEndLabel: (nodeLabel, socketLabel) => `${nodeLabel} ${socketLabel}`,
    computeCableLabel: (endLabel) => `cable from ${endLabel}`,
    computeUnplugged: (endLabel, count) =>
        `${count > SINGLE ? `${count} cables` : "Cable"} unplugged from ${endLabel}.`,
    computeSocketLabel: (endLabel, kind, isConnected) =>
        `${endLabel}, ${kind === "in" ? "input" : "output"}${isConnected ? ", connected" : ""}`,
};

const CAROUSEL_STEP_LABELS: Record<CarouselStep, string> = {
    previous: "Previous slide",
    next: "Next slide",
};

export const computeCarouselStepLabel = (step: CarouselStep) => CAROUSEL_STEP_LABELS[step];

export const computeCarouselRotationLabel = (isPlaying: boolean) =>
    isPlaying ? "Stop automatic slide show" : "Start automatic slide show";

const PAGINATOR_STEP_LABELS: Record<PaginatorStep, string> = {
    first: "First page",
    previous: "Previous page",
    next: "Next page",
    last: "Last page",
};

export const computePaginatorStepLabel = (step: PaginatorStep) => PAGINATOR_STEP_LABELS[step];

export const computePaginatorPageLabel = (page: number) => `Page ${page}`;

export const computeCuboidFaceLabel = (face: CuboidFace) => startSentence(face);

export const computeFlipCardFaceLabel = (face: FlipCardFace) => startSentence(face);

export const DATE_PART_HINTS: Record<DateInputPart, string> = {
    year: "yyyy",
    month: "mm",
    day: "dd",
};

export const TIME_SEGMENT_HINTS: Record<TimeValueUnit, string> = {
    hour: "hh",
    minute: "mm",
    second: "ss",
};

export const CALENDAR_TRIGGER_LABEL = "Open the calendar";

export const CLOCK_TRIGGER_LABEL = "Open the clock";

export const COLOR_AREA_AXIS_LABELS: Record<ColorAreaAxis, string> = {
    saturation: "Saturation",
    brightness: "Brightness",
};

export const COLOR_INPUT_LABELS = {
    pickerLabel: "Choose a color",
    areaLabel: "Saturation and brightness",
    areaAxisLabels: COLOR_AREA_AXIS_LABELS,
    hueLabel: "Hue",
};
