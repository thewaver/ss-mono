import { createMemo, splitProps } from "solid-js";

import { TileBoard, TileBoardUtils, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
import { Index2d } from "@thewaver/ss-utils";

import { PageTileBoardMeeple, PageTileBoardTile } from "../../../StyledComponents/TileBoardContent/TileBoardContent";
import type { TileBoardMeepleExampleProps } from "../TileBoardPage.types";

type Props = TileBoardMeepleExampleProps;

export const MeepleExample = (props: Props) => {
    const [, otherProps] = splitProps(props, ["tiling", "piece", "marked"]);

    const getLayout = createMemo(() =>
        TileBoardUtils.getLayout(
            access(props.tiling),
            access(otherProps.tileCount),
            access(otherProps.tileSize),
            access(otherProps.hasShortFirstRow),
            access(otherProps.taper),
        ),
    );

    return (
        <div class={styles.meepleHost}>
            <TileBoard
                {...otherProps}
                tiling={props.tiling}
                computeTileAriaLabel={(tile) => `Row ${tile.row + 1}, tile ${tile.col + 1}`}
                renderTile={(getTile, getRenderProps) => (
                    <PageTileBoardTile
                        renderProps={getRenderProps}
                        isMarked={() =>
                            Index2d.isSame(getTile(), access(props.piece)) ||
                            (access(props.marked) ?? []).includes(Index2d.toString(getTile()))
                        }
                    />
                )}
            />

            <PageTileBoardMeeple
                center={() => TileBoardUtils.getTileCenter(access(props.piece), getLayout())}
                scale={() => TileBoardUtils.getTileScale(access(props.piece), getLayout())}
                tileSize={otherProps.tileSize}
            />
        </div>
    );
};
