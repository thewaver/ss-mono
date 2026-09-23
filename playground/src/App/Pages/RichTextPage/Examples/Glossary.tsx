import { createSignal } from "solid-js";
import type { JSX, ParentProps } from "solid-js";

import { RichText, Tooltip, access } from "@thewaver/ss-components";
import type { AccessorProps } from "@thewaver/ss-components";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { GLOSSARY_CONTENT } from "../RichTextPage.const";

import * as styles from "../RichTextPage.css";

const GLOSSARY_ATTRIBUTES = { term: ["tip"] };

const TOOLTIP_PLACEMENT = { x: "center", y: "top-out" } as const;
const TOOLTIP_OFFSET = { x: 0, y: 10 };

type TermProps = AccessorProps<{
    tip: string;
}>;

const GlossaryTerm = (props: ParentProps<TermProps>) => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <span>
            <span ref={setAnchorRef} class={styles.glossaryTerm} tabIndex={0}>
                {props.children}
            </span>

            <Tooltip
                anchorRef={getAnchorRef}
                placement={TOOLTIP_PLACEMENT}
                offset={TOOLTIP_OFFSET}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        {access(props.tip)}
                    </PageTooltipContent>
                )}
            />
        </span>
    );
};

const renderGlossaryTag = (tag: string, renderChildren: () => JSX.Element, attributes: Record<string, string>) =>
    tag === "term" && attributes.tip !== undefined ? (
        <GlossaryTerm tip={attributes.tip}>{renderChildren()}</GlossaryTerm>
    ) : undefined;

export const GlossaryExample = () => (
    <div class={styles.proseText}>
        <RichText content={GLOSSARY_CONTENT} allowedAttributes={GLOSSARY_ATTRIBUTES} renderTag={renderGlossaryTag} />
    </div>
);
