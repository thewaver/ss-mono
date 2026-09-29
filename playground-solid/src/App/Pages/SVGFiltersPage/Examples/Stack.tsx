import type { Accessor, Signal } from "solid-js";

import { SVGFilterDefsFactory, Sortable, access } from "@thewaver/ss-components-solid";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components-solid";
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

const renderStep = (
    getItem: Accessor<SortableItem<SVGFiltersStep>>,
    getFlags: () => InteractionFlags<SortableItemFlags>,
) => <PageSortableItemContent flags={getFlags}>{getItem().value.name}</PageSortableItemContent>;

type Props = SVGFiltersStackExampleProps;

const StepList = (props: { items: Signal<SortableItem<SVGFiltersStep>[]>; caption: string; emptyText: string }) => (
    <div class={styles.stepColumn}>
        <div class={styles.stepCaption}>{props.caption}</div>

        <Sortable
            groupId={GROUP_ID}
            ariaLabel={props.caption}
            announcements={SORTABLE_ANNOUNCEMENTS}
            orientation={() => "vertical"}
            sizing={"fill"}
            gap={STEP_LIST_GAP}
            minHeight={STEP_LIST_MIN_HEIGHT}
            items={props.items}
            computeItemKey={computeStepKey}
            computeItemLabel={computeStepLabel}
            renderItem={renderStep}
            renderCarried={(getItem) => renderStep(getItem, () => RESTING_FLAGS)}
            renderMarker={(getOrientation) => <PageSortableMarker orientation={getOrientation} />}
            renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={props.emptyText} />}
        />
    </div>
);

export const StackExample = (props: Props) => {
    const [getApplied] = props.applied;

    return (
        <div class={styles.stack}>
            <PageFilterStage
                filterId={FILTER_ID}
                label={"stack"}
                renderDefs={() => {
                    const factory = new SVGFilterDefsFactory(FILTER_ID);

                    for (const item of getApplied()) applyStep(factory, item.value.id);

                    return factory.computeFilterPrimitives({
                        method: access(props.method),
                        elementSize: access(props.elementSize),
                    });
                }}
            />

            <div class={styles.stepLists}>
                <StepList items={props.applied} caption={"Applied"} emptyText={"Nothing applied"} />

                <StepList items={props.unused} caption={"Left out"} emptyText={"Drop here"} />
            </div>
        </div>
    );
};
