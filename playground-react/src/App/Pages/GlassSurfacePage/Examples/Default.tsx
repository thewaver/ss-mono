import { useId, useRef, useState } from "react";

import { GlassSurface, InteractionTrackerReactUtils, SVGDefsSamples } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
import knight from "@thewaver/ss-playground-core/App/knight.webp";
import { CSSUtils, type Point2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { GlassSurfaceExampleProps } from "../GlassSurfacePage.types";

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
                    borderRadii={CSSUtils.spreadRadius(borderRadius)}
                    borderWidths={CSSUtils.spreadWidth(borderWidth)}
                    computeStrokeDefs={(size, element) => {
                        if (strokeConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, "stroke");

                        return SVGDefsSamples.Gradient.Tracked.toConfig({
                            family: strokeConfigKey,
                            defs: strokeConfigDefs,
                        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`stroke-${id}`, undefined, element, {
                            getSize: () => size,
                            colors,
                            blurWidth,
                        });
                    }}
                    glassDefs={{
                        noise: {
                            frequency: noiseFrequency,
                            octaves: noiseOctaves,
                        },
                        backdrop: { blurRadius },
                        ripple: { scale: rippleScale },
                        tint: { color: tintColor, opacity: tintOpacity },
                        sheen: {
                            lightHeight,
                            surfaceScale,
                            specularConstant,
                            specularExponent,
                        },
                    }}
                >
                    <div className={styles.paneContent}>Glass</div>
                </GlassSurface>

                <div className={styles.paneShadow} style={{ borderRadius: `${borderRadius}px` }} />
            </div>
        </div>
    );
};
