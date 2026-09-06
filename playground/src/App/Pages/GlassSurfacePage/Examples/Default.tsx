import { createSignal } from "solid-js";

import { GlassSurface, InteractionTracker, access } from "@thewaver/ss-components";
import { CSSUtils, type Point2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import knight from "../../../knight.webp";
import type { GlassSurfaceExampleProps } from "../GlassSurfacePage.types";

import * as styles from "../GlassSurfacePage.css";

const STARTING_RATIO: Point2d = { x: 0.5, y: 0.5 };
const HALF_PANE = styles.paneSize * 0.5;

const toOffset = (ratio: number) =>
    `clamp(0px, calc(${ratio * 100}% - ${HALF_PANE}px), calc(100% - ${styles.paneSize}px))`;

export const DefaultExample = ({
    borderRadius,
    blurRadius,
    noiseFrequency,
    noiseOctaves,
    noiseSeed,
    rippleScale,
    tintColor,
    tintOpacity,
    lightHeight,
    surfaceScale,
    specularConstant,
    specularExponent,
}: GlassSurfaceExampleProps) => {
    const [getStageRef, setStageRef] = createSignal<HTMLElement>();
    const [getRatio, setRatio] = createSignal(STARTING_RATIO);

    let grabOffset: Point2d | undefined;

    const { getIsDragging } = InteractionTracker.trackDrag(getStageRef, () => false, {
        onDrag: (ratio) => {
            grabOffset ??= { x: ratio.x - getRatio().x, y: ratio.y - getRatio().y };

            setRatio({ x: ratio.x - grabOffset.x, y: ratio.y - grabOffset.y });
        },
        onDragEnd: () => {
            grabOffset = undefined;
        },
    });

    return (
        <div ref={setStageRef} class={styles.stage} style={{ "background-image": `url(${knight})` }}>
            <div
                class={styles.paneHost}
                data-dragging={getIsDragging() ? "" : undefined}
                style={assignInlineVars({
                    [styles.paneLeftVar]: toOffset(getRatio().x),
                    [styles.paneTopVar]: toOffset(getRatio().y),
                })}
            >
                <GlassSurface
                    borderRadii={() => CSSUtils.spreadRadius(access(borderRadius))}
                    glassDefs={() => ({
                        noise: {
                            frequency: access(noiseFrequency),
                            octaves: access(noiseOctaves),
                            seed: access(noiseSeed),
                        },
                        backdrop: { blurRadius: access(blurRadius) },
                        ripple: { scale: access(rippleScale) },
                        tint: { color: access(tintColor), opacity: access(tintOpacity) },
                        sheen: {
                            lightHeight: access(lightHeight),
                            surfaceScale: access(surfaceScale),
                            specularConstant: access(specularConstant),
                            specularExponent: access(specularExponent),
                        },
                    })}
                >
                    <div class={styles.paneContent}>Glass</div>
                </GlassSurface>

                <div class={styles.paneShadow} style={{ "border-radius": `${access(borderRadius)}px` }} />
            </div>
        </div>
    );
};
