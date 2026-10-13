import { Shape, access } from "@thewaver/ss-components-solid";
import {
    EDGE_THICKNESSES,
    FOCUS_THICKNESSES,
    MEEPLE_WIDTH_RATIO,
} from "@thewaver/ss-playground/App/StyledComponents/TileBoardContent/TileBoardContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TileBoardContent/TileBoardContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTileBoardMeepleProps, PageTileBoardTileProps } from "./TileBoardContentSolid.types";

export const PageTileBoardTile = (props: PageTileBoardTileProps) => {
    const getLayerClass = useLayerClass();

    const getRenderProps = () => access(props.renderProps);

    const getStrokeColor = () =>
        getRenderProps().isFocusVisible ? themeVars.color.outline.main : themeVars.color.primary.main;

    return (
        <div
            class={styles.tileBoardTile}
            classList={{ [getLayerClass()]: true, [styles.isMarked]: access(props.isMarked) }}
        >
            <Shape
                computePoints={() => getRenderProps().points}
                computeStrokeDefs={() => [{ color: getStrokeColor() }]}
                strokeGeom={() => [
                    { thicknesses: getRenderProps().isFocusVisible ? FOCUS_THICKNESSES : EDGE_THICKNESSES },
                ]}
                renderChildren={(_, getClipPath) => (
                    <div
                        class={styles.tileBoardTileContent}
                        classList={{
                            [styles.isMarked]: access(props.isMarked),
                            [styles.isHovered]: getRenderProps().isHovered,
                            [styles.isDisabled]: getRenderProps().isDisabled,
                        }}
                        style={{ "clip-path": `path("${getClipPath()}")` }}
                        aria-hidden={"true"}
                    >
                        {`${getRenderProps().tile.row}:${getRenderProps().tile.col}`}
                    </div>
                )}
            />
        </div>
    );
};

export const PageTileBoardMeeple = (props: PageTileBoardMeepleProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.tileBoardMeeple, getLayerClass()].join(" ")}
            style={{
                left: `${access(props.center).x}px`,
                top: `${access(props.center).y}px`,
                width: `${access(props.tileSize).width * MEEPLE_WIDTH_RATIO * access(props.scale)}px`,
            }}
            data-meeple
            aria-hidden={"true"}
        />
    );
};
