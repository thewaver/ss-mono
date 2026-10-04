import { Button, Tree } from "@thewaver/ss-components-solid";

import { PageControlColumn } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

export const OutsideExample = (props: Props) => (
    <PageControlColumn>
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={() => FILES}
            value={props.value}
            expanded={props.expanded}
            ariaLabel={"Repository, collapsed from outside"}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                    {getNode().value}
                </PageTreeNodeContent>
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
                    props.expanded[1]((prev) => prev.filter((value) => value !== "Lib"));
                }, OUTSIDE_COLLAPSE_DELAY_MS);
            }}
        />
    </PageControlColumn>
);
