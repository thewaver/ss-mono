import { useCallback, useMemo, useRef } from "react";

import { ElementObserverReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";
import { DefaultExample } from "./Default";

const NO_EDGE_THICKNESSES = [0];

export const ShapedExample = ({
    shapeKind,
    joinRadius,
    ...otherProps
}: ParticleFieldExampleProps & { shapeKind: ShapeConst.DefaultShape; joinRadius: number }) => {
    const rootRef = useRef<HTMLDivElement>(null);

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);

    const computeShapePoints = useCallback(
        (size: Size2d) => ShapeConst.getDefaultShapePoints(shapeKind, size),
        [shapeKind],
    );

    const shapeJoinRadii = useMemo(() => [joinRadius], [joinRadius]);

    const outlinePath = useMemo(
        () => ShapeUtils.getPaths(computeShapePoints(size), NO_EDGE_THICKNESSES, shapeJoinRadii).outerPath,
        [computeShapePoints, size, shapeJoinRadii],
    );

    return (
        <div ref={rootRef} className={styles.shapedRoot}>
            <svg className={styles.shapeOutline} aria-hidden="true">
                <path d={outlinePath} />
            </svg>

            <DefaultExample {...otherProps} computeShapePoints={computeShapePoints} shapeJoinRadii={shapeJoinRadii} />
        </div>
    );
};
