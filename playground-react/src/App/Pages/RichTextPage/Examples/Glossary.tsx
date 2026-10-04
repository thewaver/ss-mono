import { useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";

import { RichText, Tooltip } from "@thewaver/ss-components-react";
import { GLOSSARY_CONTENT } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";

const GLOSSARY_ATTRIBUTES = { term: ["tip"] };

const TOOLTIP_PLACEMENT = { x: "center", y: "top-out" } as const;
const TOOLTIP_OFFSET = { x: 0, y: 10 };

type TermProps = {
    tip: string;
};

const GlossaryTerm = (props: PropsWithChildren<TermProps>) => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <span>
            <span ref={setAnchorRef} className={styles.glossaryTerm} tabIndex={0}>
                {props.children}
            </span>

            <Tooltip
                anchorRef={anchorRef ?? undefined}
                placement={TOOLTIP_PLACEMENT}
                offset={TOOLTIP_OFFSET}
                hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        {props.tip}
                    </PageTooltipContent>
                )}
            />
        </span>
    );
};

const renderGlossaryTag = (tag: string, renderChildren: () => ReactNode, attributes: Record<string, string>) =>
    tag === "term" && attributes.tip !== undefined ? (
        <GlossaryTerm tip={attributes.tip}>{renderChildren()}</GlossaryTerm>
    ) : undefined;

export const GlossaryExample = () => (
    <div className={styles.proseText}>
        <RichText content={GLOSSARY_CONTENT} allowedAttributes={GLOSSARY_ATTRIBUTES} renderTag={renderGlossaryTag} />
    </div>
);
