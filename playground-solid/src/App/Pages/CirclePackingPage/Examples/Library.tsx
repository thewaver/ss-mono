import { CirclePacking, TreemapUtils } from "@thewaver/ss-components-solid";
import type { CirclePackingNode } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.css";
import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

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
        <div class={styles.frame}>
            <PageCirclePackingFrame>
                <CirclePacking<string>
                    root={() => LIBRARY}
                    branchSignal={props.branchSignal}
                    padding={props.padding}
                    zoomDurationMs={props.zoomDurationMs}
                    ariaLabel={"The library's source, by lines of code"}
                    renderCircle={(getNode, getState) => (
                        <PageCirclePackingCircle
                            state={getState}
                            title={() => getTitle(getNode(), getState().weight)}
                        />
                    )}
                    renderLabel={(getNode, getState) => (
                        <PageCirclePackingLabel state={getState} name={() => getNode().value} />
                    )}
                />
            </PageCirclePackingFrame>
        </div>
    );
};
