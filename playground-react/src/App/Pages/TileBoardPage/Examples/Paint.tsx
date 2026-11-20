import { TileBoard } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
import { Index2d } from "@thewaver/ss-utils";

import { PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardExampleProps } from "../TileBoardPage.types";

type Props = TileBoardExampleProps;

export const PaintExample = (props: Props) => {
    const { shape, marked, ...otherProps } = props;

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
        </div>
    );
};
