import { Button, Tree } from "@thewaver/ss-components-react";

import { PageControlColumn } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

export const OutsideExample = (props: Props) => (
    <PageControlColumn>
        <Tree
            nodes={FILES}
            value={props.value}
            expanded={props.expanded}
            ariaLabel={"Repository, collapsed from outside"}
            renderNode={(node, renderProps) => (
                <PageTreeNodeContent renderProps={renderProps}>{node.value}</PageTreeNodeContent>
            )}
        />

        <Button
            renderContent={(flags) => (
                <PageButtonContent flags={flags}>{`Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`}</PageButtonContent>
            )}
            onClick={async () => {
                setTimeout(() => {
                    props.expanded[1]((prev) => prev.filter((value) => value !== "Lib"));
                }, OUTSIDE_COLLAPSE_DELAY_MS);
            }}
        />
    </PageControlColumn>
);
