import { createUniqueId } from "solid-js";

import { Shape, access } from "@thewaver/ss-components-solid";
import { WRAPPED_TEXT } from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst } from "@thewaver/ss-utils";

import type { ShapeExampleProps } from "../ShapePage.types";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePageSolid.const";

const FLOAT_SIZE = 256;

type Props = ShapeExampleProps;

export const TextWrapExample = (props: Props) => {
    const id = createUniqueId();

    return (
        <div class={styles.wrapText}>
            <Shape
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                computePoints={(size) => ShapeConst.getDefaultShapePoints(access(props.shapeKind), size)}
                strokeGeom={() => [{ thicknesses: access(props.edgeThicknesses) }]}
                computeFillDefs={(getSize, getRef) => computeShapeFillDefs(id, props, getSize, getRef)}
                computeStrokeDefs={(getSize, getRef) => computeShapeStrokeDefs(id, props, getSize, getRef)}
                renderChildren={() => <div style={{ width: `${FLOAT_SIZE}px`, height: `${FLOAT_SIZE}px` }} />}
            />
            {WRAPPED_TEXT}
        </div>
    );
};
