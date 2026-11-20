import { useMemo } from "react";

import { TileBoard, TileBoardUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
import { Index2d } from "@thewaver/ss-utils";

import { PageTileBoardMeeple, PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardMeepleExampleProps } from "../TileBoardPage.types";

type Props = TileBoardMeepleExampleProps;

export const MeepleExample = (props: Props) => {
    const { shape, piece, marked, ...otherProps } = props;

    const layout = useMemo(
        () =>
            TileBoardUtils.getLayout(
                props.shape,
                otherProps.tileCount,
                otherProps.tileSize,
                otherProps.hasShortFirstRow,
                otherProps.taper,
            ),
        [props.shape, otherProps.tileCount, otherProps.tileSize, otherProps.hasShortFirstRow, otherProps.taper],
    );

    return (
        <div className={styles.meepleHost}>
            <TileBoard
                {...otherProps}
                tiling={props.shape}
                computeTileAriaLabel={(tile) => `Row ${tile.row + 1}, tile ${tile.col + 1}`}
                renderTile={(tile, renderProps) => (
                    <PageTileBoardTile
                        renderProps={renderProps}
                        isMarked={
                            Index2d.isSame(tile, props.piece) || (props.marked ?? []).includes(Index2d.toString(tile))
                        }
                    />
                )}
            />

            <PageTileBoardMeeple
                center={TileBoardUtils.getTileCenter(props.piece, layout)}
                scale={TileBoardUtils.getTileScale(props.piece, layout)}
                tileSize={otherProps.tileSize}
            />
        </div>
    );
};
