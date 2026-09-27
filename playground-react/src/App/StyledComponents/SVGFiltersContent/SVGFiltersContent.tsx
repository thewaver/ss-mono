import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SVGFiltersContent/SVGFiltersContent.css";

import type { PageFilterStageProps } from "./SVGFiltersContent.types";

export const PageFilterStage = (props: PageFilterStageProps) => {
    const defsElement = props.renderDefs();

    return (
        <div className={styles.filterStageRoot}>
            <svg className={styles.filterStageDefs} aria-hidden="true">
                <defs>{defsElement}</defs>
            </svg>

            <div
                className={styles.filterStageSubject}
                style={{ filter: defsElement ? `url(#${props.filterId})` : undefined }}
                data-subject={props.filterId}
            >
                <span className={styles.filterStageWord}>{props.label}</span>
            </div>
        </div>
    );
};
