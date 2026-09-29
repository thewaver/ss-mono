import { Icicle, TreemapUtils } from "@thewaver/ss-components-solid";
import type { IcicleNode } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/IciclePage/IciclePage.css";
import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";
import { PAGE_ICICLE_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

import { PageIcicleCell } from "../../../StyledComponents/IcicleContent/IcicleContent";
import type { IcicleExampleProps } from "../IciclePage.types";

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
                focus={props.focus}
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
