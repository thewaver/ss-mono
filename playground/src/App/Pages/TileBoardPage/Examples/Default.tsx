import { For, createMemo } from "solid-js";

import { TileBoard, TileBoardUtils, access } from "@thewaver/ss-components";
import { Count2d, Count2dString } from "@thewaver/ss-utils";

import { PageTileBoardMeeple, PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardExampleProps } from "../TileBoardPage.types";

import * as styles from "../TileBoardPage.css";

type Props = TileBoardExampleProps;

export const DefaultExample = ({ shape, marked, ...otherProps }: Props) => {
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
                        isMarked={() => access(marked).includes(Count2d.toString(getTile()))}
                    />
                )}
            />

            <For each={access(marked)}>
                {(key) => (
                    <PageTileBoardMeeple
                        center={() => TileBoardUtils.getTileCenter(Count2dString.fromString(key), getLayout())}
                        tileSize={otherProps.tileSize}
                    />
                )}
            </For>
        </div>
    );
};
