import { createSignal, createUniqueId } from "solid-js";

import { GlassSurface, InteractionTrackerUtils, SVGDefsSamples, access } from "@thewaver/ss-components";
import { CSSUtils, type Point2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { NO_SAMPLE_KEY, computeNoSampleDefs } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import knight from "../../../knight.webp";
import type { GlassSurfaceExampleProps } from "../GlassSurfacePage.types";

import * as styles from "../GlassSurfacePage.css";

const STARTING_RATIO: Point2d = { x: 0.5, y: 0.5 };
const HALF_PANE = styles.paneSize * 0.5;

const toOffset = (ratio: number) =>
    `clamp(0px, calc(${ratio * 100}% - ${HALF_PANE}px), calc(100% - ${styles.paneSize}px))`;

export const DefaultExample = ({
    borderRadius,
    borderWidth,
    strokeConfigKey,
    strokeConfigDefs,
    colors,
    blurWidth,
    blurRadius,
    noiseFrequency,
    noiseOctaves,
    rippleScale,
    tintColor,
    tintOpacity,
    lightHeight,
    surfaceScale,
    specularConstant,
    specularExponent,
}: GlassSurfaceExampleProps) => {
    const id = createUniqueId();

    const [getStageRef, setStageRef] = createSignal<HTMLElement>();
    const [getRatio, setRatio] = createSignal(STARTING_RATIO);

    let grabOffset: Point2d | undefined;

    const { getIsDragging } = InteractionTrackerUtils.trackDrag(getStageRef, () => false, {
        onDrag: (ratio) => {
            grabOffset ??= { x: ratio.x - getRatio().x, y: ratio.y - getRatio().y };

            setRatio({ x: ratio.x - grabOffset.x, y: ratio.y - grabOffset.y });
        },
        onDragEnd: () => {
            grabOffset = undefined;
        },
    });

    const getStrokeKey = () => access(strokeConfigKey);

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
                    borderWidths={() => CSSUtils.spreadWidth(access(borderWidth))}
                    computeStrokeDefs={(getSize, getRef) => {
                        const strokeKey = getStrokeKey();

                        if (strokeKey === NO_SAMPLE_KEY) return computeNoSampleDefs(access(colors), "stroke");

                        return SVGDefsSamples.Gradient.Tracked.toConfig({
                            family: strokeKey,
                            defs: access(strokeConfigDefs),
                        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`stroke-${id}`, undefined, getRef, {
                            getSize,
                            colors: access(colors),
                            blurWidth: access(blurWidth),
                        });
                    }}
                    glassDefs={() => ({
                        noise: {
                            frequency: access(noiseFrequency),
                            octaves: access(noiseOctaves),
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
