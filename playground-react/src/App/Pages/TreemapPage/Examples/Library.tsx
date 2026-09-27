import { useMemo } from "react";

import { Button, Treemap, TreemapUtils } from "@thewaver/ss-components-react";
import { LIBRARY, formatLines } from "@thewaver/ss-playground-core/App/Pages/TreemapPage/TreemapPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TreemapPage/TreemapPage.css";

import { PageTreemapBar, PageTreemapTile } from "../../../StyledComponents/TreemapContent/TreemapContent";
import type { TreemapExampleProps } from "../TreemapPage.types";

const PARENT_FROM_END = 2;
const ROOT_ONLY = 1;

type Props = TreemapExampleProps;

export const LibraryExample = (props: Props) => {
    const [branch, setBranch] = props.branchState;

    const weights = useMemo(() => TreemapUtils.computeWeights(LIBRARY), []);

    const path = useMemo(() => TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY], [branch]);

    return (
        <div className={styles.frame}>
            <Button
                id={"treemapUp"}
                sizing={"fill"}
                isDisabled={path.length <= ROOT_ONLY}
                renderContent={(flags) => (
                    <PageTreemapBar
                        flags={flags}
                        path={path.map((node) => node.value).join("/")}
                        weight={formatLines(weights.get(branch) ?? 0)}
                    />
                )}
                onClick={() => {
                    const parent = path[path.length - PARENT_FROM_END];

                    if (parent) setBranch(parent);
                }}
            />

            <div className={styles.chart}>
                <Treemap<string>
                    root={LIBRARY}
                    branchState={props.branchState}
                    zoomDurationMs={props.zoomDurationMs}
                    ariaLabel={"The library's source, by lines of code"}
                    renderTile={(node, state) => (
                        <PageTreemapTile
                            name={node.value}
                            weight={formatLines(state.weight)}
                            isBranch={state.isBranch}
                        />
                    )}
                />
            </div>
        </div>
    );
};
