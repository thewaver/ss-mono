import { createMemo } from "solid-js";

import { Button, Sunburst, TreemapUtils, access } from "@thewaver/ss-components";
import type { SunburstNode } from "@thewaver/ss-components";

import { PageSunburstArc, PageSunburstHub } from "../../../StyledComponents/SunburstContent/SunburstContent";
import { LIBRARY, formatLines } from "../../TreemapPage/TreemapPage.const";
import type { SunburstExampleProps } from "../SunburstPage.types";

import { PAGE_SUNBURST_FAMILIES } from "../../../StyledComponents/SunburstContent/SunburstContent.css";
import * as styles from "../SunburstPage.css";

const PARENT_FROM_END = 2;
const ROOT_ONLY = 1;
const TOP_LEVEL = 1;
const HALF_PERCENT = 50;

type Props = SunburstExampleProps;

export const LibraryExample = (props: Props) => {
    const [getBranch, setBranch] = props.branchSignal;

    const getWeights = createMemo(() => TreemapUtils.computeWeights(LIBRARY));

    const getPath = createMemo(() => TreemapUtils.findPath(LIBRARY, getBranch()) ?? [LIBRARY]);

    const getHubInset = createMemo(
        () => `${(access(props.ringCount) / (access(props.ringCount) + ROOT_ONLY)) * HALF_PERCENT}%`,
    );

    const getFamily = (node: SunburstNode<string>) => {
        const topLevel = TreemapUtils.findPath(LIBRARY, node)?.[TOP_LEVEL] ?? node;
        const index = Math.max(0, LIBRARY.children?.indexOf(topLevel) ?? 0);

        return PAGE_SUNBURST_FAMILIES[index % PAGE_SUNBURST_FAMILIES.length];
    };

    const getTitle = (node: SunburstNode<string>, weight: number) =>
        `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

    return (
        <div class={styles.frame}>
            <Sunburst<string>
                root={() => LIBRARY}
                branchSignal={props.branchSignal}
                ringCount={props.ringCount}
                zoomDurationMs={props.zoomDurationMs}
                ariaLabel={"The library's source, by lines of code"}
                renderArc={(getNode, getState) => (
                    <PageSunburstArc
                        state={getState}
                        family={() => getFamily(getNode())}
                        name={() => getNode().value}
                        title={() => getTitle(getNode(), getState().weight)}
                    />
                )}
            />

            <div class={styles.hub} style={{ inset: getHubInset() }}>
                <Button
                    id={"sunburstUp"}
                    sizing={"fill"}
                    isDisabled={() => getPath().length <= ROOT_ONLY}
                    renderContent={(getFlags) => (
                        <PageSunburstHub
                            flags={getFlags}
                            name={() => getBranch().value}
                            weight={() => formatLines(getWeights().get(getBranch()) ?? 0)}
                        />
                    )}
                    onClick={() => {
                        const parent = getPath()[getPath().length - PARENT_FROM_END];

                        if (parent) setBranch(parent);
                    }}
                />
            </div>
        </div>
    );
};
