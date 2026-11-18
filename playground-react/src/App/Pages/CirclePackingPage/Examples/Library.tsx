import { CirclePacking, TreemapUtils } from "@thewaver/ss-components-react";
import type { CirclePackingNode } from "@thewaver/ss-components-react";
import { LIBRARY } from "@thewaver/ss-playground/App/LibraryTree.generated";
import { formatLines } from "@thewaver/ss-playground/App/LibraryTree.utils";
import { LIBRARY_S_SOURCE_LINES_LABEL } from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.css";

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
                    branch={props.branch}
                    padding={props.padding}
                    zoomDurationMs={props.zoomDurationMs}
                    ariaLabel={LIBRARY_S_SOURCE_LINES_LABEL}
                    renderCircle={(node, state) => (
                        <PageCirclePackingCircle state={state} title={getTitle(node, state.weight)} />
                    )}
                    renderLabel={(node, state) => <PageCirclePackingLabel state={state} name={node.value} />}
                />
            </PageCirclePackingFrame>
        </div>
    );
};
