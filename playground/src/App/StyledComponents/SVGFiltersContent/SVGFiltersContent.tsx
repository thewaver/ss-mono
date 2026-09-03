import { createMemo } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { PageFilterStageProps } from "./SVGFiltersContent.types";

import * as styles from "./SVGFiltersContent.css";

export const PageFilterStage = (props: PageFilterStageProps) => {
    const getDefsElement = createMemo(() => props.renderDefs());

    return (
        <div class={styles.filterStageRoot}>
            <svg class={styles.filterStageDefs} aria-hidden="true">
                <defs>{getDefsElement()}</defs>
            </svg>

            <div
                class={styles.filterStageSubject}
                style={{ filter: getDefsElement() ? `url(#${access(props.filterId)})` : undefined }}
                data-subject={access(props.filterId)}
            >
                <span class={styles.filterStageWord}>{access(props.label)}</span>
            </div>
        </div>
    );
};
