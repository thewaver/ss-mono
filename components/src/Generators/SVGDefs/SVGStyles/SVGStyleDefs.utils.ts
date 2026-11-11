import { type Point2d, type ShapeJoinRadius, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ShapeFillClip, ShapeFillGeom } from "../../../Exotics/Shape/Shape.types";
import type { SVGGradientColor } from "../SVGGradients/SVGGradientDefs.types";
import { SVGGradientDefsUtils } from "../SVGGradients/SVGGradientDefs.utils";
import type { SVGStyleDefs, SVGStyleGradientPaint, SVGStylePaint, SVGStyleSource } from "./SVGStyleDefs.types";

type Rgba = { r: number; g: number; b: number; a: number };

type StopEntry = { color: Rgba; at: number | undefined };

type ResolvedStop = { color: Rgba; at: number };

type GradientBox = { outer: Size2d; left: number; top: number; width: number; height: number };

type BorderWidths = { top: number; right: number; bottom: number; left: number };

type CornerRadii = Size2d[];

type StyleBox = {
    size: Size2d;
    borders: BorderWidths;
    padding: BorderWidths;
    radii: CornerRadii;
    lameExponents: number[];
    points: Point2d[];
    outerPath: string;
};

type Rect = { x: number; y: number; width: number; height: number };

type AxisTiling = { start: number; period: number; tile: number };

type FillLayer = { paint: SVGStylePaint; geom: ShapeFillGeom | undefined };

const HALF = 0.5;
const SQRT_TWO = Math.SQRT2;
const PERCENT = 100;
const HALF_TURN_DEGREES = 180;
const FULL_TURN_DEGREES = 360;
const GRAD_PER_TURN = 400;
const DEFAULT_LINEAR_ANGLE = 180;
const ALPHA_BLEND_STEPS = 16;
const WARNING_PREFIX = "SVGStyleDefsUtils skipped";
const SHADOW_REACH_DEVIATIONS = 3;

const RGBA_PATTERN = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+)(%)?)?\s*\)$/i;
const LENGTH_PATTERN = /^(-?[\d.]+(?:e[+-]?\d+)?)(%|px)$/i;
const ANGLE_PATTERN = /^(-?[\d.]+(?:e[+-]?\d+)?)(deg|grad|rad|turn)$/i;
const GRADIENT_PATTERN = /^(repeating-)?(linear|radial)-gradient\((.*)\)$/is;

const ROUND_CORNER_PARAMETER = 1;
const CORNER_SHAPE_PARAMETERS: Record<string, number> = {
    round: 1,
    squircle: 2,
    square: Infinity,
    bevel: 0,
    scoop: -1,
    notch: -Infinity,
};
const CORNER_SHAPE_PROPERTIES = [
    "corner-top-left-shape",
    "corner-top-right-shape",
    "corner-bottom-right-shape",
    "corner-bottom-left-shape",
];
const SUPERELLIPSE_PATTERN = /^superellipse\(\s*(-?infinity|-?[\d.]+(?:e[+-]?\d+)?)\s*\)$/i;
const CALC_POSITION_PATTERN = /^calc\(\s*(-?[\d.]+)%\s*([+-])\s*([\d.]+)px\s*\)$/i;
const NUMBER_PATTERN = /^-?[\d.]+(?:e[+-]?\d+)?$/i;
const AXIS_REPEATS = ["repeat", "no-repeat", "space", "round"];
const BORDER_IMAGE_REPEATS = ["stretch", "repeat", "round", "space"];
const BOX_KINDS = ["border-box", "padding-box", "content-box"];
const PAINTLESS_BORDER_STYLES = ["none", "hidden"];
const SIDE_ANGLES: Record<string, number> = { top: 0, right: 90, bottom: 180, left: 270 };
const HORIZONTAL_SIGNS: Record<string, number> = { left: -1, right: 1 };
const VERTICAL_SIGNS: Record<string, number> = { top: -1, bottom: 1 };
const HORIZONTAL_PLACES: Record<string, number> = { left: 0, center: 50, right: 100 };
const VERTICAL_PLACES: Record<string, number> = { top: 0, center: 50, bottom: 100 };
const RADIAL_EXTENTS = ["closest-side", "closest-corner", "farthest-side", "farthest-corner"];

const warnSkipped = (property: string, value: string) => console.warn(`${WARNING_PREFIX} ${property}: ${value}`);

const splitTopLevel = (text: string, isSeparator: (character: string) => boolean) => {
    const parts: string[] = [];
    let depth = 0;
    let current = "";

    for (const character of text) {
        if (character === "(") depth++;
        if (character === ")") depth--;

        if (depth === 0 && isSeparator(character)) {
            parts.push(current);
            current = "";
        } else {
            current += character;
        }
    }

    parts.push(current);

    return parts.map((part) => part.trim()).filter((part) => part !== "");
};

const splitList = (text: string) => splitTopLevel(text, (character) => character === ",");

const splitWords = (text: string) => splitTopLevel(text, (character) => /\s/.test(character));

const readLayerValue = (value: string, layerIndex: number) => {
    const list = splitList(value);

    return list[layerIndex % list.length] ?? "";
};

const parseRgba = (text: string): Rgba | undefined => {
    const match = RGBA_PATTERN.exec(text);

    if (!match) return undefined;

    const alpha = match[4] === undefined ? 1 : Number(match[4]) / (match[5] ? PERCENT : 1);

    return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: alpha };
};

const printRgba = (color: Rgba) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

const parseLength = (text: string) => {
    const match = LENGTH_PATTERN.exec(text);

    return match ? { value: Number(match[1]), isPercent: match[2] === "%" } : undefined;
};

const resolveLength = (text: string, percentOf: number) => {
    const length = parseLength(text);

    if (!length) return undefined;

    return length.isPercent ? (length.value * percentOf) / PERCENT : length.value;
};

const parseAngleDegrees = (text: string) => {
    const match = ANGLE_PATTERN.exec(text);

    if (!match) return undefined;

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === "deg") return value;
    if (unit === "turn") return value * FULL_TURN_DEGREES;
    if (unit === "grad") return (value * FULL_TURN_DEGREES) / GRAD_PER_TURN;

    return (value * HALF_TURN_DEGREES) / Math.PI;
};

const parseStopEntries = (args: string[], lineLength: number) => {
    const entries: StopEntry[] = [];

    for (const arg of args) {
        const words = splitWords(arg);
        const color = parseRgba(words[0] ?? "");

        if (!color || words.length > 3) return undefined;

        const positions = words.slice(1).map((word) => {
            const length = parseLength(word);

            if (!length) return undefined;

            return length.isPercent ? length.value : (length.value * PERCENT) / lineLength;
        });

        if (positions.includes(undefined)) return undefined;

        if (positions.length === 0) entries.push({ color, at: undefined });

        positions.forEach((at) => entries.push({ color, at }));
    }

    return entries.length < 2 ? undefined : entries;
};

const resolveStopEntries = (entries: StopEntry[]): ResolvedStop[] => {
    let highest = -Infinity;

    const pinned: SVGGradientColor[] = entries.map((entry, index) => {
        const given = entry.at ?? (index === 0 ? 0 : index === entries.length - 1 ? PERCENT : undefined);

        if (given === undefined) return { value: "" };

        highest = Math.max(highest, given);

        return { value: "", stop: highest };
    });

    return SVGGradientDefsUtils.resolveStops(pinned).map((at, index) => ({ color: entries[index].color, at }));
};

const widenCollapsedStops = (stops: ResolvedStop[]) => {
    const first = stops[0];
    const last = stops[stops.length - 1];

    if (first.at !== last.at) return stops;

    return [{ color: first.color, at: first.at - PERCENT }, ...stops, { color: last.color, at: last.at + PERCENT }];
};

const computeSegmentColors = (from: ResolvedStop, to: ResolvedStop): ResolvedStop[] => {
    const start = from.color.a === 0 ? { ...to.color, a: 0 } : from.color;
    const end = to.color.a === 0 ? { ...from.color, a: 0 } : to.color;
    const isSameRgb = start.r === end.r && start.g === end.g && start.b === end.b;

    if (start.a === end.a || isSameRgb || from.at === to.at) {
        return [
            { color: start, at: from.at },
            { color: end, at: to.at },
        ];
    }

    return Array.from({ length: ALPHA_BLEND_STEPS + 1 }, (_unused, step) => {
        const t = step / ALPHA_BLEND_STEPS;
        const a = start.a + (end.a - start.a) * t;
        const blend = (near: number, far: number) => (near * start.a * (1 - t) + far * end.a * t) / a;

        return {
            color: { r: blend(start.r, end.r), g: blend(start.g, end.g), b: blend(start.b, end.b), a },
            at: from.at + (to.at - from.at) * t,
        };
    });
};

const computeGradientColors = (stops: ResolvedStop[], from: number, to: number): SVGGradientColor[] => {
    const colors: SVGGradientColor[] = [];

    stops.slice(1).forEach((stop, index) => {
        computeSegmentColors(stops[index], stop).forEach((point) => {
            const value = printRgba(point.color);
            const offset = ((point.at - from) * PERCENT) / (to - from);
            const last = colors[colors.length - 1];

            if (last?.value !== value || last.stop !== offset) colors.push({ value, stop: offset });
        });
    });

    return colors;
};

const computeLinearDirection = (arg: string | undefined, box: GradientBox): Point2d | undefined => {
    if (arg === undefined) {
        return computeAngleDirection(DEFAULT_LINEAR_ANGLE);
    }

    const words = splitWords(arg);

    if (words[0] !== "to") {
        const degrees = parseAngleDegrees(arg);

        return degrees === undefined ? undefined : computeAngleDirection(degrees);
    }

    if (words.length === 2) {
        return Object.hasOwn(SIDE_ANGLES, words[1]) ? computeAngleDirection(SIDE_ANGLES[words[1]]) : undefined;
    }

    if (words.length !== 3) return undefined;

    const horizontal = words.slice(1).find((word) => Object.hasOwn(HORIZONTAL_SIGNS, word));
    const vertical = words.slice(1).find((word) => Object.hasOwn(VERTICAL_SIGNS, word));

    if (!horizontal || !vertical) return undefined;

    const x = HORIZONTAL_SIGNS[horizontal] * box.height;
    const y = VERTICAL_SIGNS[vertical] * box.width;
    const length = Math.hypot(x, y);

    return length > 0 ? { x: x / length, y: y / length } : undefined;
};

const computeAngleDirection = (degrees: number): Point2d => {
    const radians = (degrees * Math.PI) / HALF_TURN_DEGREES;

    return { x: Math.sin(radians), y: -Math.cos(radians) };
};

const computeLinearPaint = (
    args: string[],
    isRepeating: boolean,
    id: string,
    box: GradientBox,
): SVGStyleGradientPaint | undefined => {
    const hasDirection = args[0] !== undefined && !parseRgba(splitWords(args[0])[0] ?? "");

    if (hasDirection && splitWords(args[0]).includes("in")) return undefined;

    const direction = computeLinearDirection(hasDirection ? args[0] : undefined, box);

    if (!direction) return undefined;

    const lineLength = Math.abs(box.width * direction.x) + Math.abs(box.height * direction.y);

    if (lineLength <= 0) return undefined;

    const entries = parseStopEntries(hasDirection ? args.slice(1) : args, lineLength);

    if (!entries) return undefined;

    const resolved = resolveStopEntries(entries);
    const stops = isRepeating ? resolved : widenCollapsedStops(resolved);
    const from = stops[0].at;
    const to = stops[stops.length - 1].at;

    if (to <= from) return undefined;

    const span = ((to - from) * lineLength) / PERCENT;
    const gradientX = (box.outer.width * direction.x) / span;
    const gradientY = (box.outer.height * direction.y) / span;
    const gradientLengthSquared = gradientX * gradientX + gradientY * gradientY;
    const vectorX = gradientX / gradientLengthSquared;
    const vectorY = gradientY / gradientLengthSquared;
    const vectorLength = Math.hypot(vectorX, vectorY);
    const middle = (((from + to) * HALF - PERCENT * HALF) * lineLength) / PERCENT;

    return {
        kind: "linear_gradient",
        gradient: {
            id,
            spreadMethod: isRepeating ? "repeat" : "pad",
            colors: computeGradientColors(stops, from, to),
            angle: (Math.atan2(vectorY, vectorX) * HALF_TURN_DEGREES) / Math.PI,
            scale: { width: vectorLength, height: vectorLength },
            offset: {
                x: (box.left + box.width * HALF + direction.x * middle) / box.outer.width - HALF,
                y: (box.top + box.height * HALF + direction.y * middle) / box.outer.height - HALF,
            },
        },
    };
};

const resolvePlace = (word: string, places: Record<string, number>, extent: number) =>
    Object.hasOwn(places, word) ? (places[word] * extent) / PERCENT : resolveLength(word, extent);

const computeRadialCenter = (words: string[], box: GradientBox): Point2d | undefined => {
    if (words.length === 0) return { x: box.width * HALF, y: box.height * HALF };
    if (words.length > 2) return undefined;

    const [first, second = "center"] = words;
    const isSwapped = Object.hasOwn(VERTICAL_SIGNS, first) || Object.hasOwn(HORIZONTAL_SIGNS, second);
    const x = resolvePlace(isSwapped ? second : first, HORIZONTAL_PLACES, box.width);
    const y = resolvePlace(isSwapped ? first : second, VERTICAL_PLACES, box.height);

    return x === undefined || y === undefined ? undefined : { x, y };
};

const computeRadialRadii = (words: string[], center: Point2d, box: GradientBox): Size2d | undefined => {
    const lengths = words.filter((word) => parseLength(word));

    if (lengths.length === 1) {
        const radius = parseLength(lengths[0]);

        return radius && !radius.isPercent ? { width: radius.value, height: radius.value } : undefined;
    }

    if (lengths.length === 2) {
        const width = resolveLength(lengths[0], box.width);
        const height = resolveLength(lengths[1], box.height);

        return width === undefined || height === undefined ? undefined : { width, height };
    }

    if (lengths.length > 2) return undefined;

    const extent = words.find((word) => RADIAL_EXTENTS.includes(word)) ?? "farthest-corner";
    const pick = extent.startsWith("closest") ? Math.min : Math.max;
    const nearX = pick(Math.abs(center.x), Math.abs(box.width - center.x));
    const nearY = pick(Math.abs(center.y), Math.abs(box.height - center.y));
    const isCorner = extent.endsWith("corner");

    if (words.includes("circle")) {
        const radius = isCorner ? Math.hypot(nearX, nearY) : pick(nearX, nearY);

        return { width: radius, height: radius };
    }

    return isCorner ? { width: nearX * SQRT_TWO, height: nearY * SQRT_TWO } : { width: nearX, height: nearY };
};

const computeRadialPaint = (
    args: string[],
    isRepeating: boolean,
    id: string,
    box: GradientBox,
): SVGStyleGradientPaint | undefined => {
    const hasConfig = args[0] !== undefined && !parseRgba(splitWords(args[0])[0] ?? "");
    const configWords = hasConfig ? splitWords(args[0]) : [];

    if (configWords.includes("in")) return undefined;

    const atIndex = configWords.indexOf("at");
    const shapeWords = atIndex < 0 ? configWords : configWords.slice(0, atIndex);
    const center = computeRadialCenter(atIndex < 0 ? [] : configWords.slice(atIndex + 1), box);

    if (!center) return undefined;

    const radii = computeRadialRadii(shapeWords, center, box);

    if (!radii || radii.width <= 0 || radii.height <= 0) return undefined;

    const entries = parseStopEntries(hasConfig ? args.slice(1) : args, radii.width);

    if (!entries) return undefined;

    const stops = resolveStopEntries(entries);
    const from = stops[0].at;
    const to = stops[stops.length - 1].at;

    if (from < 0 || to <= 0 || (isRepeating && from > 0)) return undefined;

    return {
        kind: "radial_gradient",
        gradient: {
            id,
            spreadMethod: isRepeating ? "repeat" : "pad",
            colors: computeGradientColors(stops, 0, to),
            origin: { x: (box.left + center.x) / box.outer.width, y: (box.top + center.y) / box.outer.height },
            aspect: {
                width: (radii.width * to) / (box.outer.width * PERCENT * HALF),
                height: (radii.height * to) / (box.outer.height * PERCENT * HALF),
            },
        },
    };
};

const computeGradientPaint = (image: string, id: string, box: GradientBox) => {
    const match = GRADIENT_PATTERN.exec(image.trim());

    if (!match) return undefined;

    const compute = match[2].toLowerCase() === "linear" ? computeLinearPaint : computeRadialPaint;

    return compute(splitList(match[3]), match[1] !== undefined, id, box);
};

const findUnsupportedLayerProperty = (style: SVGStyleSource, layerIndex: number) => {
    const attachment = readLayerValue(style.backgroundAttachment, layerIndex);
    const origin = readLayerValue(style.backgroundOrigin, layerIndex);
    const clip = readLayerValue(style.backgroundClip, layerIndex);
    const blend = readLayerValue(style.backgroundBlendMode, layerIndex);

    if (attachment !== "scroll") return ["background-attachment", attachment];
    if (!BOX_KINDS.includes(origin)) return ["background-origin", origin];
    if (!BOX_KINDS.includes(clip)) return ["background-clip", clip];
    if (blend !== "normal") return ["background-blend-mode", blend];

    return undefined;
};

const computeGradientBox = (size: Size2d, clipInsets: BorderWidths, originInsets: BorderWidths): GradientBox => ({
    outer: {
        width: size.width - clipInsets.left - clipInsets.right,
        height: size.height - clipInsets.top - clipInsets.bottom,
    },
    left: originInsets.left - clipInsets.left,
    top: originInsets.top - clipInsets.top,
    width: size.width - originInsets.left - originInsets.right,
    height: size.height - originInsets.top - originInsets.bottom,
});

const NO_EDGES: BorderWidths = { top: 0, right: 0, bottom: 0, left: 0 };

const computeUniformEdges = (length: number): BorderWidths => ({
    top: length,
    right: length,
    bottom: length,
    left: length,
});

const addEdges = (first: BorderWidths, second: BorderWidths): BorderWidths => ({
    top: first.top + second.top,
    right: first.right + second.right,
    bottom: first.bottom + second.bottom,
    left: first.left + second.left,
});

const getIsNoEdges = (edges: BorderWidths) =>
    edges.top === 0 && edges.right === 0 && edges.bottom === 0 && edges.left === 0;

const computeBoxEdges = (kind: string, box: StyleBox) => {
    if (kind === "border-box") return NO_EDGES;
    if (kind === "padding-box") return box.borders;

    return addEdges(box.borders, box.padding);
};

const shrinkRadii = (radii: CornerRadii, insets: BorderWidths): CornerRadii => {
    const shrink = (radius: Size2d, horizontal: number, vertical: number) => ({
        width: Math.max(0, radius.width - horizontal),
        height: Math.max(0, radius.height - vertical),
    });

    return [
        shrink(radii[0], insets.left, insets.top),
        shrink(radii[1], insets.right, insets.top),
        shrink(radii[2], insets.right, insets.bottom),
        shrink(radii[3], insets.left, insets.bottom),
    ];
};

const spreadRadius = (radius: number, growth: number) => {
    const adjusted = growth > 0 && radius < growth ? growth * (1 + (radius / growth - 1) ** 3) : growth;

    return Math.max(0, radius + adjusted);
};

const spreadRadii = (radii: CornerRadii, growth: number): CornerRadii =>
    radii.map((radius) => ({
        width: spreadRadius(radius.width, growth),
        height: spreadRadius(radius.height, growth),
    }));

const computeBoxGeom = (insets: BorderWidths, radii: CornerRadii): ShapeFillGeom => ({
    offsets: [-insets.top, -insets.right, -insets.bottom, -insets.left],
    joinRadii: toJoinRadii(radii),
});

const computeInsetGeom = (insets: BorderWidths, radii: CornerRadii) =>
    getIsNoEdges(insets) ? undefined : computeBoxGeom(insets, shrinkRadii(radii, insets));

const computeRectGeom = (box: StyleBox, rect: Rect): ShapeFillGeom => ({
    offsets: [-rect.y, rect.x + rect.width - box.size.width, rect.y + rect.height - box.size.height, -rect.x],
    joinRadii: [0],
});

const computeNoRepeatPeriod = (box: StyleBox, tile: number, start: number) =>
    (box.size.width + box.size.height) * 2 + tile + Math.abs(start);

const parsePosition = (value: string, free: number) => {
    const length = parseLength(value);

    if (length) return length.isPercent ? (free * length.value) / PERCENT : length.value;

    const match = CALC_POSITION_PATTERN.exec(value);

    if (!match) return undefined;

    const pixels = Number(match[3]) * (match[2] === "-" ? -1 : 1);

    return (free * Number(match[1])) / PERCENT + pixels;
};

const parseAxisRepeats = (value: string) => {
    const words = splitWords(value);

    if (words.length === 2) return words;
    if (words[0] === "repeat-x") return ["repeat", "no-repeat"];
    if (words[0] === "repeat-y") return ["no-repeat", "repeat"];

    return [words[0], words[0]];
};

const computeLayerTileSize = (value: string, area: Size2d) => {
    if (value === "cover" || value === "contain") return { size: area, isAutoWidth: false, isAutoHeight: false };

    const [first = "auto", second = "auto"] = splitWords(value);
    const width = first === "auto" ? area.width : resolveLength(first, area.width);
    const height = second === "auto" ? area.height : resolveLength(second, area.height);

    if (width === undefined || height === undefined) return undefined;

    return { size: { width, height }, isAutoWidth: first === "auto", isAutoHeight: second === "auto" };
};

const roundTile = (length: number, tile: number) => length / Math.max(1, Math.round(length / tile));

const computeLayerAxis = (
    box: StyleBox,
    mode: string,
    areaStart: number,
    areaLength: number,
    tile: number,
    offset: number,
): AxisTiling => {
    const count = Math.floor(areaLength / tile);

    if (mode === "space" && count >= 2) {
        return { start: areaStart, period: tile + (areaLength - count * tile) / (count - 1), tile };
    }

    if (mode === "repeat" || mode === "round") return { start: areaStart + offset, period: tile, tile };

    return { start: areaStart + offset, period: computeNoRepeatPeriod(box, tile, offset), tile };
};

const computeLayerTiling = (style: SVGStyleSource, box: StyleBox, layerIndex: number, originInsets: BorderWidths) => {
    const area = {
        width: box.size.width - originInsets.left - originInsets.right,
        height: box.size.height - originInsets.top - originInsets.bottom,
    };
    const sizeValue = readLayerValue(style.backgroundSize, layerIndex);
    const sized = computeLayerTileSize(sizeValue, area);
    const repeats = parseAxisRepeats(readLayerValue(style.backgroundRepeat, layerIndex));
    const positions = splitWords(readLayerValue(style.backgroundPosition, layerIndex));

    if (!sized) return { kind: "skipped" as const, property: "background-size", value: sizeValue };

    if (!repeats.every((mode) => AXIS_REPEATS.includes(mode))) {
        return {
            kind: "skipped" as const,
            property: "background-repeat",
            value: readLayerValue(style.backgroundRepeat, layerIndex),
        };
    }

    let { width, height } = sized.size;

    if (width <= 0 || height <= 0) return undefined;

    const roundedWidth = repeats[0] === "round" ? roundTile(area.width, width) : width;
    const roundedHeight = repeats[1] === "round" ? roundTile(area.height, height) : height;

    if (repeats[0] === "round" && repeats[1] !== "round" && sized.isAutoHeight) height *= roundedWidth / width;
    if (repeats[1] === "round" && repeats[0] !== "round" && sized.isAutoWidth) width *= roundedHeight / height;

    width = repeats[0] === "round" ? roundedWidth : width;
    height = repeats[1] === "round" ? roundedHeight : height;

    const offsetX = parsePosition(positions[0] ?? "", area.width - width);
    const offsetY = parsePosition(positions[1] ?? "", area.height - height);

    if (offsetX === undefined || offsetY === undefined) {
        return {
            kind: "skipped" as const,
            property: "background-position",
            value: readLayerValue(style.backgroundPosition, layerIndex),
        };
    }

    return {
        kind: "tiled" as const,
        x: computeLayerAxis(box, repeats[0], originInsets.left, area.width, width, offsetX),
        y: computeLayerAxis(box, repeats[1], originInsets.top, area.height, height, offsetY),
        isWholeArea: width === area.width && height === area.height && offsetX === 0 && offsetY === 0,
    };
};

const expandSides = (value: string) => {
    const words = splitWords(value).filter((word) => word !== "fill");
    const [top, right = top, bottom = top, left = right] = words;

    return [top, right, bottom, left];
};

const parseBorderImageLength = (value: string | undefined, borderWidth: number, percentOf: number) => {
    if (value === undefined) return undefined;
    if (NUMBER_PATTERN.test(value)) return Number(value) * borderWidth;

    return resolveLength(value, percentOf);
};

const computeBorderImageAxis = (mode: string, regionStart: number, regionLength: number, tile: number) => {
    if (mode === "stretch") return { start: regionStart, period: regionLength, tile: regionLength };

    if (mode === "round") {
        const rounded = roundTile(regionLength, tile);

        return { start: regionStart, period: rounded, tile: rounded };
    }

    if (mode === "repeat") return { start: regionStart + (regionLength - tile) * HALF, period: tile, tile };

    const count = Math.floor(regionLength / tile);

    if (count < 1) return undefined;

    const gap = (regionLength - count * tile) / (count + 1);

    return { start: regionStart + gap, period: tile + gap, tile };
};

const computeBorderImageLayers = (style: SVGStyleSource, box: StyleBox, id: string): FillLayer[] => {
    const source = style.borderImageSource;

    if (source === "none" || source === "") return [];

    const sideWidths = [box.borders.top, box.borders.right, box.borders.bottom, box.borders.left];
    const outsetWords = expandSides(style.borderImageOutset);
    const outsets = outsetWords.map((word, side) => parseBorderImageLength(word, sideWidths[side], 0));
    const repeats = splitWords(style.borderImageRepeat);
    const horizontalMode = repeats[0];
    const verticalMode = repeats[1] ?? repeats[0];

    if (
        outsets.includes(undefined) ||
        ![horizontalMode, verticalMode].every((mode) => BORDER_IMAGE_REPEATS.includes(mode))
    ) {
        warnSkipped("border-image", `${style.borderImageOutset} ${style.borderImageRepeat}`);

        return [];
    }

    const [outsetTop, outsetRight, outsetBottom, outsetLeft] = outsets as number[];
    const area = {
        x: -outsetLeft,
        y: -outsetTop,
        width: box.size.width + outsetLeft + outsetRight,
        height: box.size.height + outsetTop + outsetBottom,
    };
    const sliceWords = expandSides(style.borderImageSlice);
    const hasFill = splitWords(style.borderImageSlice).includes("fill");
    const slices = sliceWords.map((word, side) => {
        const extent = side % 2 === 0 ? area.height : area.width;
        const slice =
            word !== undefined && NUMBER_PATTERN.test(word) ? Number(word) : resolveLength(word ?? "", extent);

        return slice === undefined ? undefined : Math.min(slice, extent);
    });
    const widths = expandSides(style.borderImageWidth).map((word, side) =>
        word === "auto"
            ? slices[side]
            : parseBorderImageLength(word, sideWidths[side], side % 2 === 0 ? area.height : area.width),
    );

    if (slices.includes(undefined) || widths.includes(undefined)) {
        warnSkipped("border-image", `${style.borderImageSlice} / ${style.borderImageWidth}`);

        return [];
    }

    const [sliceTop, sliceRight, sliceBottom, sliceLeft] = slices as number[];
    const fit = Math.min(
        1,
        area.width / ((widths[1] as number) + (widths[3] as number) || 1),
        area.height / ((widths[0] as number) + (widths[2] as number) || 1),
    );
    const [widthTop, widthRight, widthBottom, widthLeft] = (widths as number[]).map((width) => width * fit);
    const columns = [area.x, area.x + widthLeft, area.x + area.width - widthRight, area.x + area.width];
    const rows = [area.y, area.y + widthTop, area.y + area.height - widthBottom, area.y + area.height];
    const sourceColumns = [0, sliceLeft, area.width - sliceRight, area.width];
    const sourceRows = [0, sliceTop, area.height - sliceBottom, area.height];
    const pickScale = (...scales: number[]) => scales.find((scale) => Number.isFinite(scale) && scale > 0) ?? 1;
    const middleScaleX = pickScale(widthTop / sliceTop, widthBottom / sliceBottom);
    const middleScaleY = pickScale(widthLeft / sliceLeft, widthRight / sliceRight);
    const layers: FillLayer[] = [];

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            const isMiddleColumn = column === 1;
            const isMiddleRow = row === 1;

            if (isMiddleColumn && isMiddleRow && !hasFill) continue;

            const region = {
                x: columns[column],
                y: rows[row],
                width: columns[column + 1] - columns[column],
                height: rows[row + 1] - rows[row],
            };
            const slice = {
                x: sourceColumns[column],
                y: sourceRows[row],
                width: sourceColumns[column + 1] - sourceColumns[column],
                height: sourceRows[row + 1] - sourceRows[row],
            };

            if (region.width <= 0 || region.height <= 0 || slice.width <= 0 || slice.height <= 0) continue;

            const tileWidth = !isMiddleColumn
                ? region.width
                : isMiddleRow
                  ? slice.width * middleScaleX
                  : slice.width * (region.height / slice.height);
            const tileHeight = !isMiddleRow
                ? region.height
                : isMiddleColumn
                  ? slice.height * middleScaleY
                  : slice.height * (region.width / slice.width);
            const x = isMiddleColumn
                ? computeBorderImageAxis(horizontalMode, region.x, region.width, tileWidth)
                : { start: region.x, period: region.width, tile: region.width };
            const y = isMiddleRow
                ? computeBorderImageAxis(verticalMode, region.y, region.height, tileHeight)
                : { start: region.y, period: region.height, tile: region.height };

            if (!x || !y) continue;

            const tileId = `${id}-border-image-${row}-${column}`;
            const gradient = computeGradientPaint(source, `${tileId}-gradient`, {
                outer: { width: area.width, height: area.height },
                left: 0,
                top: 0,
                width: area.width,
                height: area.height,
            });

            if (!gradient) {
                warnSkipped("border-image-source", source);

                return [];
            }

            layers.push({
                paint: {
                    kind: "tile",
                    gradient,
                    tile: {
                        id: tileId,
                        x: x.start,
                        y: y.start,
                        width: x.period,
                        height: y.period,
                        tileWidth: x.tile,
                        tileHeight: y.tile,
                        source: slice,
                        imageWidth: area.width,
                        imageHeight: area.height,
                    },
                },
                geom: computeRectGeom(box, region),
            });
        }
    }

    return layers;
};

const parseShadow = (shadow: string) => {
    const allWords = splitWords(shadow);
    const words = allWords.filter((word) => word !== "inset");
    const lengths = words.map((word) => parseLength(word));
    const colors = words.filter((_word, index) => !lengths[index]);
    const pixels = lengths.flatMap((length) => (length && !length.isPercent ? [length.value] : []));

    if (colors.length !== 1 || pixels.length < 2 || pixels.length !== lengths.filter(Boolean).length) return undefined;

    const [dx, dy, blur = 0, spread = 0] = pixels;

    return { color: colors[0], dx, dy, blur, spread, isInset: words.length !== allWords.length };
};

const computeShadowLayer = (shadow: string, box: StyleBox, id: string): FillLayer | undefined => {
    const parsed = parseShadow(shadow);

    if (!parsed) {
        warnSkipped("box-shadow", shadow);

        return undefined;
    }

    const { color, dx, dy, blur, spread, isInset } = parsed;
    const holeWidth = box.size.width - box.borders.left - box.borders.right - spread * 2;
    const holeHeight = box.size.height - box.borders.top - box.borders.bottom - spread * 2;

    if (parseRgba(color)?.a === 0 || color === "transparent") return undefined;

    if (isInset && (holeWidth <= 0 || holeHeight <= 0)) {
        warnSkipped("box-shadow", shadow);

        return undefined;
    }

    const stdDeviation = blur * HALF;
    const margin = Math.abs(dx) + Math.abs(dy) + Math.abs(spread) + stdDeviation * SHADOW_REACH_DEVIATIONS + 1;
    const region = {
        x: -margin / box.size.width,
        y: -margin / box.size.height,
        width: 1 + (margin * 2) / box.size.width,
        height: 1 + (margin * 2) / box.size.height,
    };
    const paddingRadii = shrinkRadii(box.radii, box.borders);
    const geom = isInset
        ? computeBoxGeom(addEdges(box.borders, computeUniformEdges(spread)), spreadRadii(paddingRadii, -spread))
        : spread === 0
          ? undefined
          : computeBoxGeom(computeUniformEdges(-spread), spreadRadii(box.radii, spread));
    const isClipped = spread !== 0;
    const clip: ShapeFillClip | undefined = !isClipped
        ? undefined
        : isInset
          ? { id: `${id}-cutout`, ...computeInsetGeom(box.borders, box.radii) }
          : { id: `${id}-cutout`, isInverted: true };

    return {
        paint: { kind: "shadow", shadow: { id, color, dx, dy, stdDeviation, isInset, region, isClipped } },
        geom: clip ? { ...geom, clip } : geom,
    };
};

const computeShadowLayers = (style: SVGStyleSource, box: StyleBox, id: string) => {
    const layers = style.boxShadow === "none" || style.boxShadow === "" ? [] : splitList(style.boxShadow);
    const computed = layers.map((shadow, index) => computeShadowLayer(shadow, box, `${id}-shadow-${index}`)).reverse();
    const present = computed.filter((layer): layer is FillLayer => layer !== undefined);

    return {
        outer: present.filter((layer) => layer.paint.kind === "shadow" && !layer.paint.shadow.isInset),
        inset: present.filter((layer) => layer.paint.kind === "shadow" && layer.paint.shadow.isInset),
    };
};

const computeBackgroundLayers = (style: SVGStyleSource, box: StyleBox, id: string) => {
    const images = splitList(style.backgroundImage);
    const layers: FillLayer[] = [];
    const baseClip = readLayerValue(style.backgroundClip, images.length - 1);
    const baseColor = parseRgba(style.backgroundColor);

    if (baseColor?.a !== 0 && style.backgroundColor !== "transparent") {
        if (BOX_KINDS.includes(baseClip)) {
            layers.push({
                paint: { kind: "color", color: style.backgroundColor },
                geom: computeInsetGeom(computeBoxEdges(baseClip, box), box.radii),
            });
        } else {
            warnSkipped("background-color with background-clip", baseClip);
        }
    }

    for (let layerIndex = images.length - 1; layerIndex >= 0; layerIndex--) {
        const image = images[layerIndex];

        if (image === "none") continue;

        const unsupported = findUnsupportedLayerProperty(style, layerIndex);

        if (unsupported) {
            warnSkipped(unsupported[0], unsupported[1]);
            continue;
        }

        const clipInsets = computeBoxEdges(readLayerValue(style.backgroundClip, layerIndex), box);
        const originInsets = computeBoxEdges(readLayerValue(style.backgroundOrigin, layerIndex), box);

        const tiling = computeLayerTiling(style, box, layerIndex, originInsets);

        if (!tiling) continue;

        if (tiling.kind === "skipped") {
            warnSkipped(tiling.property, tiling.value);
            continue;
        }

        const isTiled =
            !tiling.isWholeArea ||
            (["top", "right", "bottom", "left"] as const).some((side) => originInsets[side] !== clipInsets[side]);
        const gradientBox = isTiled
            ? {
                  outer: { width: tiling.x.tile, height: tiling.y.tile },
                  left: 0,
                  top: 0,
                  width: tiling.x.tile,
                  height: tiling.y.tile,
              }
            : computeGradientBox(box.size, clipInsets, originInsets);

        if (gradientBox.outer.width <= 0 || gradientBox.outer.height <= 0) continue;

        const layerId = `${id}-fill-${layerIndex}`;
        const gradient = computeGradientPaint(image, isTiled ? `${layerId}-tile-gradient` : layerId, gradientBox);
        const tile = {
            id: layerId,
            x: tiling.x.start,
            y: tiling.y.start,
            width: tiling.x.period,
            height: tiling.y.period,
            tileWidth: tiling.x.tile,
            tileHeight: tiling.y.tile,
            source: { x: 0, y: 0, width: tiling.x.tile, height: tiling.y.tile },
            imageWidth: tiling.x.tile,
            imageHeight: tiling.y.tile,
        };
        const paint: SVGStylePaint | undefined = gradient && isTiled ? { kind: "tile", tile, gradient } : gradient;

        if (paint) {
            layers.push({ paint, geom: computeInsetGeom(clipInsets, box.radii) });
        } else {
            warnSkipped("background-image", image);
        }
    }

    return layers;
};

const computeSideClips = (size: Size2d, borders: BorderWidths) => {
    const corners = [
        { point: { x: 0, y: 0 }, direction: { x: borders.left, y: borders.top } },
        { point: { x: size.width, y: 0 }, direction: { x: -borders.right, y: borders.top } },
        { point: { x: size.width, y: size.height }, direction: { x: -borders.right, y: -borders.bottom } },
        { point: { x: 0, y: size.height }, direction: { x: borders.left, y: -borders.bottom } },
    ];
    const seamEnds = corners.map(({ point, direction }) => {
        const reachX = direction.x === 0 ? Infinity : (size.width * HALF) / Math.abs(direction.x);
        const reachY = direction.y === 0 ? Infinity : (size.height * HALF) / Math.abs(direction.y);
        const reach = Math.min(reachX, reachY);

        return reach === Infinity ? point : { x: point.x + direction.x * reach, y: point.y + direction.y * reach };
    });

    return corners.map(({ point }, side) => {
        const next = (side + 1) % corners.length;

        return [point, corners[next].point, seamEnds[next], seamEnds[side]].map((corner) => ({
            x: corner.x / size.width,
            y: corner.y / size.height,
        }));
    });
};

const computeStrokeParts = (style: SVGStyleSource, size: Size2d, id: string, borders: BorderWidths) => {
    const sides = [
        { name: "top", width: borders.top, style: style.borderTopStyle, color: style.borderTopColor },
        { name: "right", width: borders.right, style: style.borderRightStyle, color: style.borderRightColor },
        { name: "bottom", width: borders.bottom, style: style.borderBottomStyle, color: style.borderBottomColor },
        { name: "left", width: borders.left, style: style.borderLeftStyle, color: style.borderLeftColor },
    ];
    const nothing: Pick<SVGStyleDefs, "stroke" | "strokeGeom"> = { stroke: [], strokeGeom: [] };

    if (style.borderImageSource !== "none" && style.borderImageSource !== "") return nothing;

    const thicknesses = sides.map((side) => {
        if (side.width <= 0 || PAINTLESS_BORDER_STYLES.includes(side.style)) return 0;
        if (side.style === "solid") return side.width;

        warnSkipped(`border-${side.name}-style`, side.style);

        return 0;
    });
    const paintedSides = sides.filter((_side, index) => thicknesses[index] > 0);
    const colors = [...new Set(paintedSides.map((side) => side.color))];
    const visibleColors = colors.filter((color) => parseRgba(color)?.a !== 0 && color !== "transparent");
    const clips = colors.length > 1 ? computeSideClips(size, borders) : undefined;

    return {
        stroke: visibleColors.map((color, layerIndex): SVGStylePaint => {
            if (!clips) return { kind: "color", color };

            const polygons = clips.filter((_clip, index) => thicknesses[index] > 0 && sides[index].color === color);

            return { kind: "color", color, clip: { id: `${id}-stroke-clip-${layerIndex}`, polygons } };
        }),
        strokeGeom: visibleColors.map(() => ({ thicknesses })),
    };
};

const computeCornerRadii = (property: string, value: string, size: Size2d): Size2d => {
    const words = splitWords(value);
    const width = resolveLength(words[0] ?? "", size.width);
    const height = resolveLength(words[1] ?? words[0] ?? "", size.height);

    if (width !== undefined && height !== undefined) return { width, height };

    warnSkipped(property, value);

    return { width: 0, height: 0 };
};

const computeBorderRadii = (style: SVGStyleSource, size: Size2d): CornerRadii => {
    const topLeft = computeCornerRadii("border-top-left-radius", style.borderTopLeftRadius, size);
    const topRight = computeCornerRadii("border-top-right-radius", style.borderTopRightRadius, size);
    const bottomRight = computeCornerRadii("border-bottom-right-radius", style.borderBottomRightRadius, size);
    const bottomLeft = computeCornerRadii("border-bottom-left-radius", style.borderBottomLeftRadius, size);
    const scale = Math.min(
        1,
        size.width / (topLeft.width + topRight.width || 1),
        size.height / (topRight.height + bottomRight.height || 1),
        size.width / (bottomRight.width + bottomLeft.width || 1),
        size.height / (bottomLeft.height + topLeft.height || 1),
    );

    return [topLeft, topRight, bottomRight, bottomLeft].map((radius) => ({
        width: radius.width * scale,
        height: radius.height * scale,
    }));
};

const parseSuperellipseParameter = (property: string, value: string) => {
    if (value === "") return ROUND_CORNER_PARAMETER;
    if (Object.hasOwn(CORNER_SHAPE_PARAMETERS, value)) return CORNER_SHAPE_PARAMETERS[value];

    const parameter = SUPERELLIPSE_PATTERN.exec(value)?.[1].toLowerCase();

    if (parameter === undefined) {
        warnSkipped(property, value);

        return ROUND_CORNER_PARAMETER;
    }

    if (parameter === "infinity") return Infinity;
    if (parameter === "-infinity") return -Infinity;

    return Number(parameter);
};

const toLameExponent = (parameter: number) => {
    const exponent = 2 ** parameter;

    return exponent >= 1 ? exponent - 1 : 1 - 1 / exponent;
};

const computeLameExponents = (style: SVGStyleSource) =>
    CORNER_SHAPE_PROPERTIES.map((property) =>
        toLameExponent(parseSuperellipseParameter(property, style.getPropertyValue(property).trim())),
    );

const toJoinRadii = (radii: CornerRadii): ShapeJoinRadius[] => [
    [radii[0].height, radii[0].width],
    [radii[1].width, radii[1].height],
    [radii[2].height, radii[2].width],
    [radii[3].width, radii[3].height],
];

/**
 * Turns an element's computed CSS into the descriptions an SVG fill and stroke are built from.
 *
 * The browser has already expanded shorthands and resolved `var()` in a computed style, so this reads only the
 * longhand values. A computed style is live but announces nothing, so call again when something that changes it has
 * happened: a Theme or Skin change, a hover.
 */
export namespace SVGStyleDefsUtils {
    /**
     * Converts a computed style's box shadows, background, border, corner radii and corner shapes.
     *
     * The fill is listed bottom layer first: outer box shadows, the background color, background gradients (linear
     * and radial, repeating or not, sized, positioned and repeated), inset box shadows, then a gradient border image
     * sliced into its nine regions. Each has its entry in `fillGeom` saying which area it is clipped to. A solid border
     * becomes the stroke, with its per-side widths in `strokeGeom`: one paint for one color, or one clipped paint per
     * color when the sides differ; a border image takes its place. Whatever SVG paint cannot reproduce is left out and
     * reported with `console.warn`, once per call: conic gradients, images, fixed or blended layers,
     * `background-clip: text`, gradients interpolated in another color space or holding colors other than `rgb()`,
     * color hints and patterned borders. Other CSS properties are not read.
     *
     * @param style The computed style, as `getComputedStyle` returns it.
     * @param size The size of the box being painted, which must be the box the style was computed for. With no width
     * or no height there is nothing to convert, and the result is empty.
     * @param id Prefix for the gradient ids; unique in the document, as those ids are referenced by `url(#…)`.
     * @returns The `fill` paints and their `fillGeom`, the `stroke` paints, plus `strokeGeom` and `joinRadii`, whose entries run top, right, bottom,
     * left and from the top-left corner clockwise, for a contour wound clockwise from its top-left corner. Each
     * `joinRadii` entry is a pair, `lameExponents` holds each corner's shape, and a stroke paint's `clip` holds the
     * areas it may paint, as fractions of the box.
     */
    export const computeDefsFromStyle = (style: SVGStyleSource, size: Size2d, id: string): SVGStyleDefs => {
        if (size.width <= 0 || size.height <= 0) {
            return { fill: [], fillGeom: [], stroke: [], strokeGeom: [], joinRadii: [], lameExponents: [] };
        }

        const borders = {
            top: resolveLength(style.borderTopWidth, 0) ?? 0,
            right: resolveLength(style.borderRightWidth, 0) ?? 0,
            bottom: resolveLength(style.borderBottomWidth, 0) ?? 0,
            left: resolveLength(style.borderLeftWidth, 0) ?? 0,
        };
        const padding = {
            top: resolveLength(style.paddingTop, 0) ?? 0,
            right: resolveLength(style.paddingRight, 0) ?? 0,
            bottom: resolveLength(style.paddingBottom, 0) ?? 0,
            left: resolveLength(style.paddingLeft, 0) ?? 0,
        };
        const radii = computeBorderRadii(style, size);
        const joinRadii = toJoinRadii(radii);
        const points = [
            { x: 0, y: 0 },
            { x: size.width, y: 0 },
            { x: size.width, y: size.height },
            { x: 0, y: size.height },
        ];
        const lameExponents = computeLameExponents(style);
        const outerPath = ShapeUtils.getPaths(points, [0], joinRadii, lameExponents).outerPath;
        const box: StyleBox = { size, borders, padding, radii, lameExponents, points, outerPath };
        const shadows = computeShadowLayers(style, box, id);
        const layers = [
            ...shadows.outer,
            ...computeBackgroundLayers(style, box, id),
            ...shadows.inset,
            ...computeBorderImageLayers(style, box, id),
        ];

        return {
            fill: layers.map((layer) => layer.paint),
            fillGeom: layers.map((layer) => layer.geom),
            ...computeStrokeParts(style, size, id, borders),
            joinRadii,
            lameExponents,
        };
    };
}
