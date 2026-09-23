import { createMemo } from "solid-js";

import { Button, Treemap, TreemapUtils } from "@thewaver/ss-components";

import { PageTreemapBar, PageTreemapTile } from "../../../StyledComponents/TreemapContent/TreemapContent";
import { LIBRARY, formatLines } from "../TreemapPage.const";
import type { TreemapExampleProps } from "../TreemapPage.types";

import * as styles from "../TreemapPage.css";

const PARENT_FROM_END = 2;
const ROOT_ONLY = 1;

type Props = TreemapExampleProps;

export const LibraryExample = (props: Props) => {
    const [getBranch, setBranch] = props.branchSignal;

    const getWeights = createMemo(() => TreemapUtils.computeWeights(LIBRARY));

    const getPath = createMemo(() => TreemapUtils.findPath(LIBRARY, getBranch()) ?? [LIBRARY]);

    return (
        <div class={styles.frame}>
            <Button
                id={"treemapUp"}
                sizing={"fill"}
                isDisabled={() => getPath().length <= ROOT_ONLY}
                renderContent={(getFlags) => (
                    <PageTreemapBar
                        flags={getFlags}
                        path={() =>
                            getPath()
                                .map((node) => node.value)
                                .join("/")
                        }
                        weight={() => formatLines(getWeights().get(getBranch()) ?? 0)}
                    />
                )}
                onClick={() => {
                    const parent = getPath()[getPath().length - PARENT_FROM_END];

                    if (parent) setBranch(parent);
                }}
            />

            <div class={styles.chart}>
                <Treemap<string>
                    root={() => LIBRARY}
                    branchSignal={props.branchSignal}
                    zoomDurationMs={props.zoomDurationMs}
                    ariaLabel={"The library's source, by lines of code"}
                    renderTile={(getNode, getState) => (
                        <PageTreemapTile
                            name={() => getNode().value}
                            weight={() => formatLines(getState().weight)}
                            isBranch={() => getState().isBranch}
                        />
                    )}
                />
            </div>
        </div>
    );
};
