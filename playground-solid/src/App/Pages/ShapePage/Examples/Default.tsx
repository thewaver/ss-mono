import { createMemo, createSignal, createUniqueId } from "solid-js";

import { InteractionTrackerSolidUtils, SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { ShapeExampleProps } from "../ShapePage.types";

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
    const id = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const { getFlags } = InteractionTrackerSolidUtils.wrapElement(getRootRef, () => false, {
        applyButtonSemantics: true,
    });

    const getStrokeKey = () => access(strokeConfigKey);
    const getFillKey = () => access(fillConfigKey);
    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(iterationConfigKey)];

    return (
        <div class={styles.exampleHost}>
            <Shape
                {...otherProps}
                computePoints={(size) => ShapeConst.getDefaultShapePoints(access(shapeKind), size)}
                computeStrokeDefs={(getSize, getRef) => {
                    const strokeKey = getStrokeKey();
                    const strokes =
                        strokeKey === NO_SAMPLE_KEY
                            ? computeNoSampleDefs(access(colors), "stroke")
                            : SVGDefsSamples.Gradient.Timed.toConfig({
                                  family: strokeKey,
                                  defs: access(strokeConfigDefs),
                              } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(
                                  `stroke-${id}`,
                                  getFlags,
                                  getRef,
                                  {
                                      getSize,
                                      animationDurationMs: access(animationDurationMs),
                                      colors: access(colors),
                                      blurWidth: access(blurWidth),
                                      ...getIterationConfig().computeDefs(access(animationDurationMs)),
                                  },
                              );

                    if (getFlags().isFocusVisible) {
                        strokes.push({ color: "#FF00FF" });
                    }

                    return strokes;
                }}
                strokeGeom={() => {
                    const result = [{ thicknesses: access(edgeThicknesses) }];

                    if (getFlags().isFocusVisible) {
                        result.push({ thicknesses: [2] });
                    }

                    return result;
                }}
                computeFillDefs={(getSize, getRef) =>
                    getFillKey() === NO_SAMPLE_KEY
                        ? computeNoSampleDefs(access(colors), "fill")
                        : SVGDefsSamples.Pattern.SAMPLE_CONFIGS[
                              getFillKey() as SVGDefsSamples.Pattern.SampleKey
                          ].computeSVGDefs(`fill-${id}`, undefined, getRef, {
                              getSize,
                              cellSize: access(cellSize),
                              animationDurationMs: access(animationDurationMs),
                              colors: access(colors),
                              blurWidth: access(blurWidth),
                              ...getIterationConfig().computeDefs(access(animationDurationMs)),
                          })
                }
                renderChildren={(getSize, getClipPath, getClipPoints) => {
                    const getStyle = createMemo(() => {
                        const size = getSize();
                        const shape = access(shapeKind);
                        const clipStyle = access(shouldClipChildren) ? { "clip-path": `path("${getClipPath()}")` } : {};

                        if (!access(shouldPadChildren)) return clipStyle;

                        const paddingStyle =
                            shape === "square"
                                ? ShapeUtils.getRectPadding(
                                      access(edgeThicknesses),
                                      access(otherProps.joinRadii),
                                      access(otherProps.lameExponents),
                                  )
                                : ShapeUtils.getPolygonPadding(size, getClipPoints());

                        return { ...clipStyle, ...paddingStyle };
                    });

                    return (
                        <div ref={setRootRef} class={styles.example} style={getStyle()}>
                            <div class={styles.exampleInner}>I have a border</div>
                        </div>
                    );
                }}
            />
        </div>
    );
};
