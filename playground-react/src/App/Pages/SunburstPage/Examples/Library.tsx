import { useMemo } from "react";

import { Button, Sunburst, TreemapUtils } from "@thewaver/ss-components-react";
import type { SunburstNode } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/SunburstPage/SunburstPage.css";
import { LIBRARY, formatLines } from "@thewaver/ss-playground-core/App/Pages/TreemapPage/TreemapPage.const";
import { PAGE_SUNBURST_FAMILIES } from "@thewaver/ss-playground-core/App/StyledComponents/SunburstContent/SunburstContent.css";

import { PageSunburstArc, PageSunburstHub } from "../../../StyledComponents/SunburstContent/SunburstContent";
import type { SunburstExampleProps } from "../SunburstPage.types";

const PARENT_FROM_END = 2;
const ROOT_ONLY = 1;
const TOP_LEVEL = 1;
const HALF_PERCENT = 50;

type Props = SunburstExampleProps;

const getFamily = (node: SunburstNode<string>) => {
    const topLevel = TreemapUtils.findPath(LIBRARY, node)?.[TOP_LEVEL] ?? node;
    const index = Math.max(0, LIBRARY.children?.indexOf(topLevel) ?? 0);

    return PAGE_SUNBURST_FAMILIES[index % PAGE_SUNBURST_FAMILIES.length];
};

const getTitle = (node: SunburstNode<string>, weight: number) =>
    `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

export const LibraryExample = (props: Props) => {
    const [branch, setBranch] = props.branchState;

    const weights = useMemo(() => TreemapUtils.computeWeights(LIBRARY), []);

    const path = useMemo(() => TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY], [branch]);

    const hubInset = `${(props.ringCount / (props.ringCount + ROOT_ONLY)) * HALF_PERCENT}%`;

    return (
        <div className={styles.frame}>
            <Sunburst<string>
                root={LIBRARY}
                branchState={props.branchState}
                ringCount={props.ringCount}
                zoomDurationMs={props.zoomDurationMs}
                ariaLabel={"The library's source, by lines of code"}
                renderArc={(node, state) => (
                    <PageSunburstArc
                        state={state}
                        family={getFamily(node)}
                        name={node.value}
                        title={getTitle(node, state.weight)}
                    />
                )}
            />

            <div className={styles.hub} style={{ inset: hubInset }}>
                <Button
                    id={"sunburstUp"}
                    sizing={"fill"}
                    isDisabled={path.length <= ROOT_ONLY}
                    renderContent={(flags) => (
                        <PageSunburstHub
                            flags={flags}
                            name={branch.value}
                            weight={formatLines(weights.get(branch) ?? 0)}
                        />
                    )}
                    onClick={() => {
                        const parent = path[path.length - PARENT_FROM_END];

                        if (parent) setBranch(parent);
                    }}
                />
            </div>
        </div>
    );
};
