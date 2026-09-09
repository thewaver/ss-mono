import { Tree, createRadialTree } from "@thewaver/ss-components";
import type { RadialTreeDefs } from "@thewaver/ss-components";

import { PageTreeRadialNode } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { ORBITS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

const RADIAL_DEFS: RadialTreeDefs = { innerRadiusPx: 74, ringGapPx: 82, itemWidthPx: 88, itemHeightPx: 28 };

const RADIAL_LAYOUT = createRadialTree(RADIAL_DEFS);

type Props = TreeExampleProps;

export const RadialExample = (props: Props) => {
    return (
        <Tree
            nodes={() => ORBITS}
            valueSignal={props.valueSignal}
            expandedSignal={props.expandedSignal}
            ariaLabel={"Orbits"}
            computeLayout={RADIAL_LAYOUT}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeRadialNode renderProps={getRenderProps}>{getNode().value}</PageTreeRadialNode>
            )}
        />
    );
};
