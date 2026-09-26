import { CirclePacking, TreemapUtils } from "@thewaver/ss-components";
import type { CirclePackingNode } from "@thewaver/ss-components";

import {
    PageCirclePackingCircle,
    PageCirclePackingFrame,
    PageCirclePackingLabel,
} from "../../../StyledComponents/CirclePackingContent/CirclePackingContent";
import { LIBRARY, formatLines } from "../../TreemapPage/TreemapPage.const";
import type { CirclePackingExampleProps } from "../CirclePackingPage.types";

import * as styles from "../CirclePackingPage.css";

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
