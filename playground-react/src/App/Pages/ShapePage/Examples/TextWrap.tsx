import { useId } from "react";

import { Shape } from "@thewaver/ss-components-react";
import { WRAPPED_TEXT } from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst } from "@thewaver/ss-utils";

import type { ShapeExampleProps } from "../ShapePage.types";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePageReact.const";

const FLOAT_SIZE = 256;

type Props = ShapeExampleProps;

export const TextWrapExample = (props: Props) => {
    const id = useId();

    return (
        <div className={styles.wrapText}>
            <Shape
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
                strokeGeom={[{ thicknesses: props.edgeThicknesses }]}
                computeFillDefs={(size, element) => computeShapeFillDefs(id, props, size, element)}
                computeStrokeDefs={(size, element) => computeShapeStrokeDefs(id, props, size, element)}
                renderChildren={() => <div style={{ width: `${FLOAT_SIZE}px`, height: `${FLOAT_SIZE}px` }} />}
            />
            {WRAPPED_TEXT}
        </div>
    );
};
