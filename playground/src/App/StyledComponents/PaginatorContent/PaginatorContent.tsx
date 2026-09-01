import type { PaginatorStep } from "@thewaver/ss-components";
import { access } from "@thewaver/ss-components";

import type {
    PaginatorGapContentProps,
    PaginatorPageContentProps,
    PaginatorStepContentProps,
} from "./PaginatorContent.types";

import * as styles from "./PaginatorContent.css";

const STEP_GLYPHS: Record<PaginatorStep, string> = {
    first: "«",
    previous: "‹",
    next: "›",
    last: "»",
};

export const PagePaginatorPage = (props: PaginatorPageContentProps) => {
    return (
        <div
            class={styles.paginatorPage}
            classList={{
                [styles.isCurrent]: access(props.renderProps).isCurrent,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isActive]: access(props.renderProps).isActive,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        >
            {access(props.renderProps).page}
        </div>
    );
};

export const PagePaginatorStep = (props: PaginatorStepContentProps) => {
    return (
        <div
            class={styles.paginatorStep}
            classList={{
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isActive]: access(props.renderProps).isActive,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        >
            {STEP_GLYPHS[access(props.renderProps).step]}
        </div>
    );
};

export const PagePaginatorGap = (props: PaginatorGapContentProps) => {
    return (
        <div class={styles.paginatorGap} title={`Pages ${access(props.entry).from} to ${access(props.entry).to}`}>
            …
        </div>
    );
};
