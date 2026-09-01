import { Button, Tree } from "@thewaver/ss-components";

import { PageControlColumn } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

export const OutsideExample = (props: Props) => (
    <PageControlColumn>
        <Tree
            nodes={() => FILES}
            valueSignal={props.valueSignal}
            expandedSignal={props.expandedSignal}
            ariaLabel={"Repository, collapsed from outside"}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
            )}
        />

        <Button
            renderContent={(getRenderProps) => (
                <PageButtonContent flags={getRenderProps}>
                    {`Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`}
                </PageButtonContent>
            )}
            onClick={async () => {
                setTimeout(() => {
                    props.expandedSignal[1]((prev) => prev.filter((value) => value !== "Lib"));
                }, OUTSIDE_COLLAPSE_DELAY_MS);
            }}
        />
    </PageControlColumn>
);
