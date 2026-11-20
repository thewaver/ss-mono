import { createSignal, createUniqueId } from "solid-js";

import {
    GlassSurface,
    InteractionTrackerSolidUtils,
    SVGDefsSampleConfigs,
    SVGDefsSamples,
    access,
} from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import { CSSUtils, type Point2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { GlassSurfaceExampleProps } from "../GlassSurfacePageSolid.types";

const STARTING_RATIO: Point2d = { x: 0.5, y: 0.5 };
const HALF_PANE = styles.paneSize * 0.5;

const toOffset = (ratio: number) =>
    `clamp(0px, calc(${ratio * 100}% - ${HALF_PANE}px), calc(100% - ${styles.paneSize}px))`;

export const DefaultExample = (props: GlassSurfaceExampleProps) => {
    const id = createUniqueId();

    const [getStageRef, setStageRef] = createSignal<HTMLElement>();
    const [getRatio, setRatio] = createSignal(STARTING_RATIO);

    let grabOffset: Point2d | undefined;

    const { getIsDragging } = InteractionTrackerSolidUtils.trackDrag(getStageRef, () => false, {
        onDrag: (ratio) => {
            grabOffset ??= { x: ratio.x - getRatio().x, y: ratio.y - getRatio().y };

            setRatio({ x: ratio.x - grabOffset.x, y: ratio.y - grabOffset.y });
        },
        onDragEnd: () => {
            grabOffset = undefined;
        },
    });

    const getStrokeKey = () => access(props.strokeConfigKey);

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
                    borderRadii={() => CSSUtils.spreadRadius(access(props.borderRadius))}
                    borderWidths={() => CSSUtils.spreadWidth(access(props.borderWidth))}
                    computeStrokeDefs={(getSize, getRef) => {
                        const strokeKey = getStrokeKey();

                        if (strokeKey === NO_SAMPLE_KEY) return computeNoSampleDefs(access(props.colors), "stroke");

                        return SVGDefsSampleConfigs.Gradient.Tracked.toConfig({
                            family: strokeKey,
                            defs: access(props.strokeConfigDefs),
                        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`stroke-${id}`, undefined, getRef, {
                            getSize,
                            colors: access(props.colors),
                            blurWidth: access(props.blurWidth),
                        });
                    }}
                    glassDefs={() => ({
                        noise: {
                            frequency: access(props.noiseFrequency),
                            octaves: access(props.noiseOctaves),
                        },
                        backdrop: { blurRadius: access(props.blurRadius) },
                        ripple: { scale: access(props.rippleScale) },
                        tint: { color: access(props.tintColor), opacity: access(props.tintOpacity) },
                        sheen: {
                            lightHeight: access(props.lightHeight),
                            surfaceScale: access(props.surfaceScale),
                            specularConstant: access(props.specularConstant),
                            specularExponent: access(props.specularExponent),
                        },
                    })}
                >
                    <div class={styles.paneContent}>Glass</div>
                </GlassSurface>

                <div class={styles.paneShadow} style={{ "border-radius": `${access(props.borderRadius)}px` }} />
            </div>
        </div>
    );
};
