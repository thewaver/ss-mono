import { useId } from "react";

import { Shape } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst } from "@thewaver/ss-utils";

import { PagePaintAreaGroup } from "../../../PageComponents/PaintAreaGroup/PaintAreaGroup";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

const CELL_COUNT = 4;

export const SharedPaintExample = (props: ShapeExampleProps) => {
    const id = useId();

    return (
        <PagePaintAreaGroup
            className={styles.sharedGrid}
            cellCount={CELL_COUNT}
            renderCell={(cell) => (
                <Shape
                    joinRadii={props.joinRadii}
                    lameExponents={props.lameExponents}
                    computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
                    computeStrokeDefs={() =>
                        computeShapeStrokeDefs(`${id}-${cell.index}`, props, cell.groupSize, cell.groupElement)
                    }
                    strokeGeom={[{ thicknesses: props.edgeThicknesses }]}
                    computeFillDefs={() =>
                        computeShapeFillDefs(`${id}-${cell.index}`, props, cell.groupSize, cell.groupElement)
                    }
                    renderChildren={() => <div className={styles.sharedCell} />}
                />
            )}
        />
    );
};
