import type { ParentProps } from "solid-js";

import { Shape, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/FormationContent/FormationContent.css";
import { layerVars } from "@thewaver/ss-playground-core/App/StyledComponents/Layer/Layer.css";
import { themeVars } from "@thewaver/ss-playground-core/App/Theme.css";
import { ShapeConst } from "@thewaver/ss-utils";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageFormationItemProps } from "./FormationContent.types";

const EDGE_THICKNESSES = [2];
const FILL_OPACITY = 0.75;

export const PageFormationItem = (props: ParentProps<PageFormationItemProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.formationItem, getLayerClass()].join(" ")}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints(access(props.shapeKind), size)}
                computeFillDefs={() => [{ color: layerVars.main, opacity: FILL_OPACITY }]}
                computeStrokeDefs={() => [{ color: themeVars.color.primary.main }]}
                strokeGeom={() => [{ thicknesses: EDGE_THICKNESSES }]}
                renderChildren={() => (
                    <div class={styles.formationItemContent}>
                        <div class={styles.formationItemRank}>{access(props.state).index + 1}</div>

                        {props.children}
                    </div>
                )}
            />
        </div>
    );
};
