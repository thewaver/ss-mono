import { createMemo } from "solid-js";

import { TileBoard, TileBoardUtils, access } from "@thewaver/ss-components";
import { Index2d } from "@thewaver/ss-utils";

import { PageTileBoardMeeple, PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardMeepleExampleProps } from "../TileBoardPage.types";

import * as styles from "../TileBoardPage.css";

type Props = TileBoardMeepleExampleProps;

export const MeepleExample = ({ shape, piece, ...otherProps }: Props) => {
    const getLayout = createMemo(() =>
        TileBoardUtils.getLayout(
            access(shape),
            access(otherProps.tileCount),
            access(otherProps.tileSize),
            access(otherProps.hasShortFirstRow),
        ),
    );

    return (
        <div class={styles.meepleHost}>
            <TileBoard
                {...otherProps}
                tileShape={shape}
                computeTileAriaLabel={(tile) => `Row ${tile.row + 1}, tile ${tile.col + 1}`}
                renderTile={(getTile, getRenderProps) => (
                    <PageTileBoardTile
                        renderProps={getRenderProps}
                        isMarked={() => Index2d.isSame(getTile(), access(piece))}
                    />
                )}
            />

            <PageTileBoardMeeple
                center={() => TileBoardUtils.getTileCenter(access(piece), getLayout())}
                tileSize={otherProps.tileSize}
            />
        </div>
    );
};
