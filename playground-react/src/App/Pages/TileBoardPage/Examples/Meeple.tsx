import { useMemo } from "react";

import { TileBoard, TileBoardUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TileBoardPage/TileBoardPage.css";
import { Index2d } from "@thewaver/ss-utils";

import { PageTileBoardMeeple, PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardMeepleExampleProps } from "../TileBoardPage.types";

type Props = TileBoardMeepleExampleProps;

export const MeepleExample = ({ shape, piece, marked, ...otherProps }: Props) => {
    const layout = useMemo(
        () =>
            TileBoardUtils.getLayout(
                shape,
                otherProps.tileCount,
                otherProps.tileSize,
                otherProps.hasShortFirstRow,
                otherProps.taper,
            ),
        [shape, otherProps.tileCount, otherProps.tileSize, otherProps.hasShortFirstRow, otherProps.taper],
    );

    return (
        <div className={styles.meepleHost}>
            <TileBoard
                {...otherProps}
                tileShape={shape}
                computeTileAriaLabel={(tile) => `Row ${tile.row + 1}, tile ${tile.col + 1}`}
                renderTile={(tile, renderProps) => (
                    <PageTileBoardTile
                        renderProps={renderProps}
                        isMarked={Index2d.isSame(tile, piece) || (marked ?? []).includes(Index2d.toString(tile))}
                    />
                )}
            />

            <PageTileBoardMeeple
                center={TileBoardUtils.getTileCenter(piece, layout)}
                scale={TileBoardUtils.getTileScale(piece, layout)}
                tileSize={otherProps.tileSize}
            />
        </div>
    );
};
