import { createMemo, createSignal } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { ElementObserver } from "../../Abstracts/ElementObserver/ElementObserver";
import { PointerTracker } from "../../Abstracts/PointerTracker/PointerTracker";
import { access } from "../../Utils/propUtils";
import type { RevealProps } from "./Reveal.types";

import * as styles from "./Reveal.css";

const DEFAULT_REVEAL_RADIUS = 90;
const DEFAULT_REVEAL_ROUNDNESS = 1;
const DEFAULT_REVEAL_SOFTNESS = 0.45;
const INSIDE_EDGE_RATIO = 1;
const NO_HOLE_RADIUS = 0;
const BLUR_SPREAD = 3;
const BLUR_MARGIN = 2;
const HALF = 0.5;

const buildHoleImage = (radius: number, roundness: number, softness: number) => {
    const size = radius * 2;
    const blur = ((1 - softness) * radius) / BLUR_SPREAD;
    const inset = blur * BLUR_MARGIN;
    const side = Math.max(size - inset * 2, 0);
    const corner = side * HALF * roundness;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect x="${inset}" y="${inset}" width="${side}" height="${side}" rx="${corner}" fill="black" style="filter:blur(${blur}px)"/></svg>`;

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
            MathUtils.clamp01(access(props.roundness) ?? DEFAULT_REVEAL_ROUNDNESS),
            MathUtils.clamp01(access(props.softness) ?? DEFAULT_REVEAL_SOFTNESS),
        ),
    );

    const getMaskStyle = createMemo(() => {
        if (!getHasHole()) return {};

        const size = getSize();
        const reading = getReading();
        const radius = getRadius();
        const left = reading.boxRatio.x * size.width - radius;
        const top = reading.boxRatio.y * size.height - radius;
        const layers = `linear-gradient(black, black), ${getHoleImage()}`;
        const positions = `0 0, ${left}px ${top}px`;
        const sizes = `auto, ${radius * 2}px ${radius * 2}px`;

        return {
            "mask-image": layers,
            "-webkit-mask-image": layers,
            "mask-position": positions,
            "-webkit-mask-position": positions,
            "mask-size": sizes,
            "-webkit-mask-size": sizes,
            "mask-repeat": "no-repeat",
            "-webkit-mask-repeat": "no-repeat",
            "mask-composite": "exclude",
            "-webkit-mask-composite": "xor",
        };
    });

    return (
        <div ref={setRootRef} class={styles.revealRoot}>
            {props.renderContent()}

            <div class={styles.revealCover} style={getMaskStyle()}>
                {props.renderCover(getIsRevealing)}
            </div>
        </div>
    );
};
