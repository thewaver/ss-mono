import type { CSSProperties } from "react";
import { useId, useRef } from "react";

import { InteractionTrackerReactUtils, SVGDefsSamples, Shape } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, ShapeUtils, StringUtils } from "@thewaver/ss-utils";

import type { ShapeExampleProps } from "../ShapePage.types";

const toReactStyle = (style: object): CSSProperties =>
    Object.fromEntries(Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]));

export const DefaultExample = ({
    shouldClipChildren,
    shouldPadChildren,
    shapeKind,
    strokeConfigKey,
    strokeConfigDefs,
    fillConfigKey,
    iterationConfigKey,
    cellSize,
    animationDurationMs,
    colors,
    blurWidth,
    edgeThicknesses,
    ...otherProps
}: ShapeExampleProps) => {
    const id = useId();

    const rootRef = useRef<HTMLDivElement>(null);

    const flags = InteractionTrackerReactUtils.useElementFlags(rootRef, false, { applyButtonSemantics: true });

    const iterationConfig = SVGDefsSamples.Iteration.SAMPLE_CONFIGS[iterationConfigKey];

    const strokeGeom = [{ thicknesses: edgeThicknesses }];

    if (flags.isFocusVisible) {
        strokeGeom.push({ thicknesses: [2] });
    }

    return (
        <div className={styles.exampleHost}>
            <Shape
                {...otherProps}
                computePoints={(size) => ShapeConst.getDefaultShapePoints(shapeKind, size)}
                computeStrokeDefs={(size, element) => {
                    const strokes =
                        strokeConfigKey === NO_SAMPLE_KEY
                            ? computeNoSampleDefs(colors, "stroke")
                            : SVGDefsSamples.Gradient.Timed.toConfig({
                                  family: strokeConfigKey,
                                  defs: strokeConfigDefs,
                              } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, flags, element, {
                                  getSize: () => size,
                                  animationDurationMs,
                                  colors,
                                  blurWidth,
                                  ...iterationConfig.computeDefs(animationDurationMs),
                              });

                    if (flags.isFocusVisible) {
                        strokes.push({ color: "#FF00FF" });
                    }

                    return strokes;
                }}
                strokeGeom={strokeGeom}
                computeFillDefs={(size, element) =>
                    fillConfigKey === NO_SAMPLE_KEY
                        ? computeNoSampleDefs(colors, "fill")
                        : SVGDefsSamples.Pattern.SAMPLE_CONFIGS[fillConfigKey].computeSVGDefs(
                              `fill-${id}`,
                              undefined,
                              element,
                              {
                                  getSize: () => size,
                                  cellSize,
                                  animationDurationMs,
                                  colors,
                                  blurWidth,
                                  ...iterationConfig.computeDefs(animationDurationMs),
                              },
                          )
                }
                renderChildren={(size, clipPath, clipPoints) => {
                    const clipStyle = shouldClipChildren ? { clipPath: `path("${clipPath}")` } : {};

                    const paddingStyle = !shouldPadChildren
                        ? {}
                        : toReactStyle(
                              shapeKind === "square"
                                  ? ShapeUtils.getRectPadding(
                                        edgeThicknesses,
                                        otherProps.joinRadii,
                                        otherProps.lameExponents,
                                    )
                                  : ShapeUtils.getPolygonPadding(size, clipPoints),
                          );

                    return (
                        <div ref={rootRef} className={styles.example} style={{ ...clipStyle, ...paddingStyle }}>
                            <div className={styles.exampleInner}>I have a border</div>
                        </div>
                    );
                }}
            />
        </div>
    );
};
