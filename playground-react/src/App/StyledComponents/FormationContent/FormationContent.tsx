import type { PropsWithChildren } from "react";

import { Shape } from "@thewaver/ss-components-react";
import {
    FILL_OPACITY,
    STROKE_GEOM,
} from "@thewaver/ss-playground/App/StyledComponents/FormationContent/FormationContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormationContent/FormationContent.css";
import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { ShapeConst } from "@thewaver/ss-utils";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageFormationItemProps } from "./FormationContentReact.types";

export const PageFormationItem = (props: PropsWithChildren<PageFormationItemProps>) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.formationItem, layerClass].join(" ")}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
                computeFillDefs={() => [{ color: layerVars.main, opacity: FILL_OPACITY }]}
                computeStrokeDefs={() => [{ color: themeVars.color.primary.main }]}
                strokeGeom={STROKE_GEOM}
                renderChildren={() => (
                    <div className={styles.formationItemContent}>
                        <div className={styles.formationItemRank}>{props.state.index + 1}</div>

                        {props.children}
                    </div>
                )}
            />
        </div>
    );
};
