import { Shape, access } from "@thewaver/ss-components";

import type { PageTileBoardMeepleProps, PageTileBoardTileProps } from "./TileBoardContent.types";

import { FOCUS_RING_WIDTH, themeVars } from "../../Theme.css";
import * as styles from "./TileBoardContent.css";

const EDGE_THICKNESSES = [1];
const FOCUS_THICKNESSES = [FOCUS_RING_WIDTH];
const MEEPLE_WIDTH_RATIO = 0.56;

export const PageTileBoardTile = (props: PageTileBoardTileProps) => {
    const getRenderProps = () => access(props.renderProps);

    const getStrokeColor = () =>
        getRenderProps().isFocusVisible ? themeVars.color.outline.main : themeVars.color.primary.main;

    return (
        <div class={styles.tileBoardTile} classList={{ [styles.isMarked]: access(props.isMarked) }}>
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
    return (
        <div
            class={styles.tileBoardMeeple}
            style={{
                left: `${access(props.center).x}px`,
                top: `${access(props.center).y}px`,
                width: `${access(props.tileSize).width * MEEPLE_WIDTH_RATIO}px`,
            }}
            data-meeple
            aria-hidden={"true"}
        />
    );
};
