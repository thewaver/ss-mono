import { useMemo } from "react";

import { TileBoard, TileBoardUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
import { Index2d, Index2dString } from "@thewaver/ss-utils";

import { PageTileBoardMeeple, PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardExampleProps } from "../TileBoardPage.types";

type Props = TileBoardExampleProps;

export const DefaultExample = (props: Props) => {
    const { shape, marked, ...otherProps } = props;

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
                        isMarked={props.marked.includes(Index2d.toString(tile))}
                    />
                )}
            />

            {props.marked.map((key) => (
                <PageTileBoardMeeple
                    key={key}
                    center={TileBoardUtils.getTileCenter(Index2dString.fromString(key), layout)}
                    scale={TileBoardUtils.getTileScale(Index2dString.fromString(key), layout)}
                    tileSize={otherProps.tileSize}
                />
            ))}
        </div>
    );
};
