import { createUniqueId } from "solid-js";

import { Shape, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst } from "@thewaver/ss-utils";

import { PagePaintAreaGroup } from "../../../PageComponents/PaintAreaGroup/PaintAreaGroup";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

const CELL_COUNT = 4;

export const SharedPaintExample = (props: ShapeExampleProps) => {
    const id = createUniqueId();

    return (
        <PagePaintAreaGroup
            class={styles.sharedGrid}
            cellCount={CELL_COUNT}
            renderCell={(cell) => (
                <Shape
                    joinRadii={props.joinRadii}
                    lameExponents={props.lameExponents}
                    computePoints={(size) => ShapeConst.getDefaultShapePoints(access(props.shapeKind), size)}
                    computeStrokeDefs={() =>
                        computeShapeStrokeDefs(`${id}-${cell.index}`, props, cell.getGroupSize, cell.getGroupRef)
                    }
                    strokeGeom={() => [{ thicknesses: access(props.edgeThicknesses) }]}
                    computeFillDefs={() =>
                        computeShapeFillDefs(`${id}-${cell.index}`, props, cell.getGroupSize, cell.getGroupRef)
                    }
                    renderChildren={() => <div class={styles.sharedCell} />}
                />
            )}
        />
    );
};
