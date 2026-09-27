import { CirclePacking, TreemapUtils } from "@thewaver/ss-components-react";
import type { CirclePackingNode } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/CirclePackingPage/CirclePackingPage.css";
import { LIBRARY, formatLines } from "@thewaver/ss-playground-core/App/Pages/TreemapPage/TreemapPage.const";

import {
    PageCirclePackingCircle,
    PageCirclePackingFrame,
    PageCirclePackingLabel,
} from "../../../StyledComponents/CirclePackingContent/CirclePackingContent";
import type { CirclePackingExampleProps } from "../CirclePackingPage.types";

type Props = CirclePackingExampleProps;

const getTitle = (node: CirclePackingNode<string>, weight: number) =>
    `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

export const LibraryExample = (props: Props) => {
    return (
        <div className={styles.frame}>
            <PageCirclePackingFrame>
                <CirclePacking<string>
                    root={LIBRARY}
                    branchState={props.branchState}
                    padding={props.padding}
                    zoomDurationMs={props.zoomDurationMs}
                    ariaLabel={"The library's source, by lines of code"}
                    renderCircle={(node, state) => (
                        <PageCirclePackingCircle state={state} title={getTitle(node, state.weight)} />
                    )}
                    renderLabel={(node, state) => <PageCirclePackingLabel state={state} name={node.value} />}
                />
            </PageCirclePackingFrame>
        </div>
    );
};
