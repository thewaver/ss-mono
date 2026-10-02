import type { CSSProperties } from "react";
import { useId, useRef } from "react";

import { InteractionTrackerReactUtils, Shape } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, ShapeUtils, StringUtils } from "@thewaver/ss-utils";

import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

const toReactStyle = (style: object): CSSProperties =>
    Object.fromEntries(Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]));

export const DefaultExample = (props: ShapeExampleProps) => {
    const id = useId();

    const rootRef = useRef<HTMLDivElement>(null);

    const flags = InteractionTrackerReactUtils.useElementFlags(rootRef, false, { applyButtonSemantics: true });

    const strokeGeom = [{ thicknesses: props.edgeThicknesses }];

    if (flags.isFocusVisible) {
        strokeGeom.push({ thicknesses: [2] });
    }

    return (
        <div className={styles.exampleHost}>
            <Shape
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
                computeStrokeDefs={(size, element) => {
                    const strokes = computeShapeStrokeDefs(id, props, size, element, flags);

                    if (flags.isFocusVisible) {
                        strokes.push({ color: "#FF00FF" });
                    }

                    return strokes;
                }}
                strokeGeom={strokeGeom}
                computeFillDefs={(size, element) => computeShapeFillDefs(id, props, size, element)}
                renderChildren={(size, clipPath, clipPoints) => {
                    const clipStyle = props.shouldClipChildren ? { clipPath: `path("${clipPath}")` } : {};

                    const paddingStyle = !props.shouldPadChildren
                        ? {}
                        : toReactStyle(
                              props.shapeKind === "square"
                                  ? ShapeUtils.getRectPadding(
                                        props.edgeThicknesses,
                                        props.joinRadii,
                                        props.lameExponents,
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
