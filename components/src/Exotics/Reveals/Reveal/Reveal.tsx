import { createMemo, createSignal } from "solid-js";
import type { JSX } from "solid-js";

import { MathUtils, type Point2d, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { CutoutUtils } from "../../../Abstracts/Cutout/Cutout.utils";
import { ElementObserverUtils } from "../../../Abstracts/ElementObserver/ElementObserver.utils";
import { PointerTrackerUtils } from "../../../Abstracts/PointerTracker/PointerTracker.utils";
import { access } from "../../../Utils/propUtils";
import { REVEAL_DEFAULTS } from "./Reveal.const";
import type { RevealProps } from "./Reveal.types";

import * as styles from "./Reveal.css";

const NO_EDGE_THICKNESSES = [0];
const INSIDE_EDGE_RATIO = 1;
const NO_HOLE_RADIUS = 0;
const BLUR_SPREAD = 3;
const BLUR_MARGIN = 2;
const HALF = 0.5;

const NUDGE_KEYS: Record<string, Point2d | undefined> = {
    ArrowRight: { x: 1, y: 0 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowDown: { x: 0, y: 1 },
    ArrowUp: { x: 0, y: -1 },
};

const buildHoleImage = (
    radius: number,
    softness: number,
    computePoints: ((size: Size2d) => Point2d[]) | undefined,
    joinRadii: number[] | undefined,
    lameExponents: number[] | undefined,
) => {
    const size = radius * 2;
    const blur = ((1 - softness) * radius) / BLUR_SPREAD;
    const inset = blur * BLUR_MARGIN;
    const side = Math.max(size - inset * 2, 0);
    const points = computePoints?.({ width: side, height: side });
    const paint = `fill="black" style="filter:blur(${blur}px)"`;
    const shape = points
        ? `<path d="${ShapeUtils.getPaths(points, NO_EDGE_THICKNESSES, joinRadii, lameExponents).outerPath}" transform="translate(${inset}, ${inset})" ${paint}/>`
        : `<circle cx="${radius}" cy="${radius}" r="${side * HALF}" ${paint}/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${shape}</svg>`;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

export const Reveal = (props: RevealProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) === true);

    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRootRef, getIsDisabled);

    const getSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef, getIsDisabled);

    const [getKeyboardPoint, setKeyboardPoint] = createSignal<Point2d>();

    const getRadius = createMemo(() => access(props.radius) ?? REVEAL_DEFAULTS.radius);

    const getIsPointerInside = createMemo(() => getIsPointerPresent() && getReading().edgeRatio <= INSIDE_EDGE_RATIO);

    const getIsKeyboardDriven = createMemo(() => !getIsDisabled() && getKeyboardPoint() !== undefined);

    const getIsRevealing = createMemo(() => getIsKeyboardDriven() || (!getIsDisabled() && getIsPointerInside()));

    const getHasHole = createMemo(
        () => (getIsKeyboardDriven() || (!getIsDisabled() && getIsPointerPresent())) && getRadius() > NO_HOLE_RADIUS,
    );

    const getCenter = () => ({ x: getSize().width * HALF, y: getSize().height * HALF });

    const getPointerPoint = () => ({
        x: getReading().boxRatio.x * getSize().width,
        y: getReading().boxRatio.y * getSize().height,
    });

    const getHoleCenter = createMemo(() => {
        const keyboardPoint = getKeyboardPoint();

        if (!getIsKeyboardDriven() || !keyboardPoint) return getPointerPoint();

        return {
            x: MathUtils.clamp(keyboardPoint.x, 0, getSize().width),
            y: MathUtils.clamp(keyboardPoint.y, 0, getSize().height),
        };
    });

    const getHoleImage = createMemo(() =>
        buildHoleImage(
            getRadius(),
            MathUtils.clamp01(access(props.softness) ?? REVEAL_DEFAULTS.softness),
            props.computePoints,
            access(props.joinRadii),
            access(props.lameExponents),
        ),
    );

    const getMaskStyle = createMemo<JSX.CSSProperties>(() => {
        if (!getHasHole()) return {};

        const center = getHoleCenter();
        const radius = getRadius();
        const diameter = radius * 2;
        const hole = { x: center.x - radius, y: center.y - radius, width: diameter, height: diameter };

        return CutoutUtils.getMaskStyle([{ ...hole, image: getHoleImage() }]);
    });

    const handleFocus = () => {
        if (getIsDisabled() || !getRootRef()?.matches(":focus-visible")) return;

        setKeyboardPoint(getCenter());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const nudge = NUDGE_KEYS[e.key];

        if (getIsDisabled() || !nudge || e.altKey || e.ctrlKey || e.metaKey) return;

        e.preventDefault();

        const from = getIsKeyboardDriven() ? getHoleCenter() : getIsPointerInside() ? getPointerPoint() : getCenter();
        const stepSize = access(props.stepSize) ?? REVEAL_DEFAULTS.stepSize;

        setKeyboardPoint({
            x: MathUtils.clamp(from.x + nudge.x * stepSize, 0, getSize().width),
            y: MathUtils.clamp(from.y + nudge.y * stepSize, 0, getSize().height),
        });
    };

    return (
        <div
            ref={setRootRef}
            class={styles.revealRoot}
            role="group"
            tabindex={getIsDisabled() ? undefined : 0}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() || undefined}
            onFocus={handleFocus}
            onBlur={() => setKeyboardPoint(undefined)}
            onPointerMove={() => setKeyboardPoint(undefined)}
            onKeyDown={handleKeyDown}
        >
            {props.renderContent()}

            <div class={styles.revealCover}>{props.renderCover(getIsRevealing, getMaskStyle)}</div>
        </div>
    );
};
