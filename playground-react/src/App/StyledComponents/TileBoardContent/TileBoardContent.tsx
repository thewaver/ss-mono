import { Shape } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TileBoardContent/TileBoardContent.css";
import { FOCUS_RING_WIDTH, themeVars } from "@thewaver/ss-playground-core/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTileBoardMeepleProps, PageTileBoardTileProps } from "./TileBoardContent.types";

const EDGE_THICKNESSES = [1];
const FOCUS_THICKNESSES = [FOCUS_RING_WIDTH];
const EDGE_STROKE_GEOM = [{ thicknesses: EDGE_THICKNESSES }];
const FOCUS_STROKE_GEOM = [{ thicknesses: FOCUS_THICKNESSES }];
const MEEPLE_WIDTH_RATIO = 0.56;

export const PageTileBoardTile = (props: PageTileBoardTileProps) => {
    const layerClass = useLayerClass();

    const renderProps = props.renderProps;

    const strokeColor = renderProps.isFocusVisible ? themeVars.color.outline.main : themeVars.color.primary.main;

    return (
        <div
            className={[styles.tileBoardTile, layerClass, props.isMarked && styles.isMarked].filter(Boolean).join(" ")}
        >
            <Shape
                computePoints={() => renderProps.points}
                computeStrokeDefs={() => [{ color: strokeColor }]}
                strokeGeom={renderProps.isFocusVisible ? FOCUS_STROKE_GEOM : EDGE_STROKE_GEOM}
                renderChildren={(_, clipPath) => (
                    <div
                        className={[
                            styles.tileBoardTileContent,
                            props.isMarked && styles.isMarked,
                            renderProps.isHovered && styles.isHovered,
                            renderProps.isDisabled && styles.isDisabled,
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        style={{ clipPath: `path("${clipPath}")` }}
                        aria-hidden={"true"}
                    >
                        {`${renderProps.tile.row}:${renderProps.tile.col}`}
                    </div>
                )}
            />
        </div>
    );
};

export const PageTileBoardMeeple = (props: PageTileBoardMeepleProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.tileBoardMeeple, layerClass].join(" ")}
            style={{
                left: `${props.center.x}px`,
                top: `${props.center.y}px`,
                width: `${props.tileSize.width * MEEPLE_WIDTH_RATIO * props.scale}px`,
            }}
            data-meeple=""
            aria-hidden={"true"}
        />
    );
};
