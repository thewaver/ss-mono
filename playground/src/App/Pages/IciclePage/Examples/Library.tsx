import { Icicle, TreemapUtils } from "@thewaver/ss-components";
import type { IcicleNode } from "@thewaver/ss-components";

import { PageIcicleCell } from "../../../StyledComponents/IcicleContent/IcicleContent";
import { LIBRARY, formatLines } from "../../TreemapPage/TreemapPage.const";
import type { IcicleExampleProps } from "../IciclePage.types";

import { PAGE_ICICLE_FAMILIES } from "../../../StyledComponents/IcicleContent/IcicleContent.css";
import * as styles from "../IciclePage.css";

const TOP_LEVEL = 1;

type Props = IcicleExampleProps;

const getFamily = (node: IcicleNode<string>) => {
    const topLevel = TreemapUtils.findPath(LIBRARY, node)?.[TOP_LEVEL];

    if (!topLevel) return undefined;

    return PAGE_ICICLE_FAMILIES[Math.max(0, LIBRARY.children?.indexOf(topLevel) ?? 0) % PAGE_ICICLE_FAMILIES.length];
};

const getTitle = (node: IcicleNode<string>, weight: number) =>
    `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

export const LibraryExample = (props: Props) => {
    return (
        <div class={styles.frame}>
            <Icicle<string>
                root={() => LIBRARY}
                focusSignal={props.focusSignal}
                columnCount={props.columnCount}
                zoomDurationMs={props.zoomDurationMs}
                ariaLabel={"The library's source, by lines of code"}
                renderCell={(getNode, getState) => (
                    <PageIcicleCell
                        state={getState}
                        family={() => getFamily(getNode())}
                        name={() => getNode().value}
                        weight={() => formatLines(getState().weight)}
                        title={() => getTitle(getNode(), getState().weight)}
                    />
                )}
            />
        </div>
    );
};
