import { CONTROL_GLYPHS } from "../../StyledComponents/ControlButtonContent/ControlButtonContent.const";
import type { PanZoomAction } from "./PanZoomControls.types";

const ZOOM_IN_FACTOR = 0.8;
const ZOOM_OUT_FACTOR = 1.25;
const PAN_STEP = 0.25;

export const PAN_ZOOM_ACTIONS: PanZoomAction[] = [
    { key: "ZoomOut", label: "Zoom out", glyph: CONTROL_GLYPHS.zoomOut, kind: "zoom", factor: ZOOM_OUT_FACTOR },
    { key: "ZoomIn", label: "Zoom in", glyph: CONTROL_GLYPHS.zoomIn, kind: "zoom", factor: ZOOM_IN_FACTOR },
    { key: "Left", label: "Pan left", glyph: CONTROL_GLYPHS.left, kind: "pan", ratio: { x: -PAN_STEP, y: 0 } },
    { key: "Right", label: "Pan right", glyph: CONTROL_GLYPHS.right, kind: "pan", ratio: { x: PAN_STEP, y: 0 } },
    { key: "Up", label: "Pan up", glyph: CONTROL_GLYPHS.up, kind: "pan", ratio: { x: 0, y: -PAN_STEP } },
    { key: "Down", label: "Pan down", glyph: CONTROL_GLYPHS.down, kind: "pan", ratio: { x: 0, y: PAN_STEP } },
];
