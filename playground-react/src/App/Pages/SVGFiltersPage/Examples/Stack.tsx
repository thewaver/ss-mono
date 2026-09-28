import { SVGFilterDefsFactory, Sortable } from "@thewaver/ss-components-react";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-react";
import { SORTABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    STEP_LIST_GAP,
    STEP_LIST_MIN_HEIGHT,
    computeStepKey,
    computeStepLabel,
} from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.const";
import type { SVGFiltersStep } from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFilterSteps.types";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGFiltersPage/SVGFiltersPage.css";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import {
    PageSortableItemContent,
    PageSortableMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import { applyStep } from "../SVGFiltersPage.const";
import type { SVGFiltersStackExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersStack";
const GROUP_ID = "svgFiltersSteps";

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderStep = (item: SortableItem<SVGFiltersStep>, flags: InteractionFlags<SortableItemFlags>) => (
    <PageSortableItemContent flags={flags}>{item.value.name}</PageSortableItemContent>
);

type Props = SVGFiltersStackExampleProps;

const StepList = (props: {
    itemsState: readonly [SortableItem<SVGFiltersStep>[], (items: SortableItem<SVGFiltersStep>[]) => void];
    caption: string;
    emptyText: string;
}) => (
    <div className={styles.stepColumn}>
        <div className={styles.stepCaption}>{props.caption}</div>

        <Sortable
            groupId={GROUP_ID}
            ariaLabel={props.caption}
            announcements={SORTABLE_ANNOUNCEMENTS}
            orientation={"vertical"}
            sizing={"fill"}
            gap={STEP_LIST_GAP}
            minHeight={STEP_LIST_MIN_HEIGHT}
            itemsState={props.itemsState}
            computeItemKey={computeStepKey}
            computeItemLabel={computeStepLabel}
            renderItem={renderStep}
            renderCarried={(item) => renderStep(item, RESTING_FLAGS)}
            renderMarker={(orientation) => <PageSortableMarker orientation={orientation} />}
            renderDecoration={(flags) => <PageSortableSurface flags={flags} emptyText={props.emptyText} />}
        />
    </div>
);

export const StackExample = (props: Props) => {
    const [applied] = props.appliedState;

    return (
        <div className={styles.stack}>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"stack"}
                renderDefs={() => {
                    const factory = new SVGFilterDefsFactory(FILTER_ID);

                    for (const item of applied) applyStep(factory, item.value.id);

                    return factory.computeFilterPrimitives({
                        method: props.method,
                        elementSize: props.elementSize,
                    });
                }}
            />

            <div className={styles.stepLists}>
                <StepList itemsState={props.appliedState} caption={"Applied"} emptyText={"Nothing applied"} />

                <StepList itemsState={props.unusedState} caption={"Left out"} emptyText={"Drop here"} />
            </div>
        </div>
    );
};
