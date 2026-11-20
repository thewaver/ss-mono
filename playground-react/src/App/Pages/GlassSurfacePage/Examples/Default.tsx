import { useId, useRef, useState } from "react";

import {
    GlassSurface,
    InteractionTrackerReactUtils,
    SVGDefsSampleConfigs,
    SVGDefsSamples,
} from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import { CSSUtils, type Point2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { GlassSurfaceExampleProps } from "../GlassSurfacePageReact.types";

const STARTING_RATIO: Point2d = { x: 0.5, y: 0.5 };
const HALF_PANE = styles.paneSize * 0.5;

const toOffset = (ratio: number) =>
    `clamp(0px, calc(${ratio * 100}% - ${HALF_PANE}px), calc(100% - ${styles.paneSize}px))`;

export const DefaultExample = (props: GlassSurfaceExampleProps) => {
    const id = useId();

    const stageRef = useRef<HTMLDivElement>(null);
    const grabOffsetRef = useRef<Point2d | undefined>(undefined);
    const [ratio, setRatio] = useState(STARTING_RATIO);

    const { isDragging } = InteractionTrackerReactUtils.useDrag(stageRef, false, {
        onDrag: (dragRatio) => {
            const grabOffset = (grabOffsetRef.current ??= { x: dragRatio.x - ratio.x, y: dragRatio.y - ratio.y });

            setRatio({ x: dragRatio.x - grabOffset.x, y: dragRatio.y - grabOffset.y });
        },
        onDragEnd: () => {
            grabOffsetRef.current = undefined;
        },
    });

    return (
        <div ref={stageRef} className={styles.stage} style={{ backgroundImage: `url(${knight})` }}>
            <div
                className={styles.paneHost}
                data-dragging={isDragging ? "" : undefined}
                style={assignInlineVars({
                    [styles.paneLeftVar]: toOffset(ratio.x),
                    [styles.paneTopVar]: toOffset(ratio.y),
                })}
            >
                <GlassSurface
                    borderRadii={CSSUtils.spreadRadius(props.borderRadius)}
                    borderWidths={CSSUtils.spreadWidth(props.borderWidth)}
                    computeStrokeDefs={(size, element) => {
                        if (props.strokeConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "stroke");

                        return SVGDefsSampleConfigs.Gradient.Tracked.toConfig({
                            family: props.strokeConfigKey,
                            defs: props.strokeConfigDefs,
                        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`stroke-${id}`, undefined, element, {
                            getSize: () => size,
                            colors: props.colors,
                            blurWidth: props.blurWidth,
                        });
                    }}
                    glassDefs={{
                        noise: {
                            frequency: props.noiseFrequency,
                            octaves: props.noiseOctaves,
                        },
                        backdrop: { blurRadius: props.blurRadius },
                        ripple: { scale: props.rippleScale },
                        tint: { color: props.tintColor, opacity: props.tintOpacity },
                        sheen: {
                            lightHeight: props.lightHeight,
                            surfaceScale: props.surfaceScale,
                            specularConstant: props.specularConstant,
                            specularExponent: props.specularExponent,
                        },
                    }}
                >
                    <div className={styles.paneContent}>Glass</div>
                </GlassSurface>

                <div className={styles.paneShadow} style={{ borderRadius: `${props.borderRadius}px` }} />
            </div>
        </div>
    );
};
