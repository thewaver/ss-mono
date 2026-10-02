import { createMemo, createSignal, createUniqueId } from "solid-js";

import { InteractionTrackerSolidUtils, Shape, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

export const DefaultExample = (props: ShapeExampleProps) => {
    const id = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const { getFlags } = InteractionTrackerSolidUtils.wrapElement(getRootRef, () => false, {
        applyButtonSemantics: true,
    });

    return (
        <div class={styles.exampleHost}>
            <Shape
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                computePoints={(size) => ShapeConst.getDefaultShapePoints(access(props.shapeKind), size)}
                computeStrokeDefs={(getSize, getRef) => {
                    const strokes = computeShapeStrokeDefs(id, props, getSize, getRef, getFlags);

                    if (getFlags().isFocusVisible) {
                        strokes.push({ color: "#FF00FF" });
                    }

                    return strokes;
                }}
                strokeGeom={() => {
                    const result = [{ thicknesses: access(props.edgeThicknesses) }];

                    if (getFlags().isFocusVisible) {
                        result.push({ thicknesses: [2] });
                    }

                    return result;
                }}
                computeFillDefs={(getSize, getRef) => computeShapeFillDefs(id, props, getSize, getRef)}
                renderChildren={(getSize, getClipPath, getClipPoints) => {
                    const getStyle = createMemo(() => {
                        const size = getSize();
                        const shape = access(props.shapeKind);
                        const clipStyle = access(props.shouldClipChildren)
                            ? { "clip-path": `path("${getClipPath()}")` }
                            : {};

                        if (!access(props.shouldPadChildren)) return clipStyle;

                        const paddingStyle =
                            shape === "square"
                                ? ShapeUtils.getRectPadding(
                                      access(props.edgeThicknesses),
                                      access(props.joinRadii),
                                      access(props.lameExponents),
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
