import { createMemo, createSignal } from "solid-js";
import type { JSX } from "solid-js";

import { MathUtils, type Point2d, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { CutoutUtils } from "../../Abstracts/Cutout/Cutout.utils";
import { ElementObserver } from "../../Abstracts/ElementObserver/ElementObserver";
import { PointerTracker } from "../../Abstracts/PointerTracker/PointerTracker";
import { access } from "../../Utils/propUtils";
import type { RevealProps } from "./Reveal.types";

import * as styles from "./Reveal.css";

const DEFAULT_REVEAL_RADIUS = 90;
const DEFAULT_REVEAL_SOFTNESS = 0.45;
const NO_EDGE_THICKNESSES = [0];
const INSIDE_EDGE_RATIO = 1;
const NO_HOLE_RADIUS = 0;
const BLUR_SPREAD = 3;
const BLUR_MARGIN = 2;
const HALF = 0.5;

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

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRootRef, getIsDisabled);

    const getSize = ElementObserver.createBorderBoxSizeObserver(getRootRef, () => !getIsDisabled());

    const getRadius = createMemo(() => access(props.radius) ?? DEFAULT_REVEAL_RADIUS);

    const getIsRevealing = createMemo(
        () => !getIsDisabled() && getIsPointerPresent() && getReading().edgeRatio <= INSIDE_EDGE_RATIO,
    );

    const getHasHole = createMemo(() => !getIsDisabled() && getIsPointerPresent() && getRadius() > NO_HOLE_RADIUS);

    const getHoleImage = createMemo(() =>
        buildHoleImage(
            getRadius(),
            MathUtils.clamp01(access(props.softness) ?? DEFAULT_REVEAL_SOFTNESS),
            props.computePoints,
            access(props.joinRadii),
            access(props.lameExponents),
        ),
    );

    const getMaskStyle = createMemo<JSX.CSSProperties>(() => {
        if (!getHasHole()) return {};

        const size = getSize();
        const reading = getReading();
        const radius = getRadius();
        const diameter = radius * 2;
        const hole = {
            x: reading.boxRatio.x * size.width - radius,
            y: reading.boxRatio.y * size.height - radius,
            width: diameter,
            height: diameter,
        };

        return CutoutUtils.getMaskStyle(hole, getHoleImage());
    });

    return (
        <div ref={setRootRef} class={styles.revealRoot}>
            {props.renderContent()}

            <div class={styles.revealCover}>{props.renderCover(getIsRevealing, getMaskStyle)}</div>
        </div>
    );
};
