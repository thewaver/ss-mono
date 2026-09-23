import { TileBoard, access } from "@thewaver/ss-components";
import { Index2d } from "@thewaver/ss-utils";

import { PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardExampleProps } from "../TileBoardPage.types";

import * as styles from "../TileBoardPage.css";

type Props = TileBoardExampleProps;

export const PaintExample = ({ shape, marked, ...otherProps }: Props) => (
    <div class={styles.meepleHost}>
        <TileBoard
            {...otherProps}
            tileShape={shape}
            computeTileAriaLabel={(tile) => `Row ${tile.row + 1}, tile ${tile.col + 1}`}
            renderTile={(getTile, getRenderProps) => (
                <PageTileBoardTile
                    renderProps={getRenderProps}
                    isMarked={() => access(marked).includes(Index2d.toString(getTile()))}
                />
            )}
        />
    </div>
);
