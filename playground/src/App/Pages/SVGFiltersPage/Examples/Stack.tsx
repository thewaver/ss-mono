import type { Accessor, Signal } from "solid-js";

import { SVGFilterDefsFactory, Sortable, access } from "@thewaver/ss-components";
import type { InteractionFlags, SortableItem, SortableItemFlags } from "@thewaver/ss-components";

import { PageFilterStage } from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent";
import {
    PageSortableItemContent,
    PageSortableMarker,
    PageSortableSurface,
} from "../../../StyledComponents/SortableContent/SortableContent";
import {
    STEP_LIST_GAP,
    STEP_LIST_MIN_HEIGHT,
    applyStep,
    computeStepKey,
    computeStepLabel,
} from "../SVGFiltersPage.const";
import type { SVGFiltersStackExampleProps, SVGFiltersStep } from "../SVGFiltersPage.types";

import * as styles from "../SVGFiltersPage.css";

const FILTER_ID = "svgFiltersStack";
const GROUP_ID = "svgFiltersSteps";

const RESTING_FLAGS: InteractionFlags<SortableItemFlags> = { isCarried: false, isLandingBefore: false };

const renderStep = (
    getItem: Accessor<SortableItem<SVGFiltersStep>>,
    getFlags: () => InteractionFlags<SortableItemFlags>,
) => <PageSortableItemContent flags={getFlags}>{getItem().value.name}</PageSortableItemContent>;

type Props = SVGFiltersStackExampleProps;

const StepList = (props: {
    itemsSignal: Signal<SortableItem<SVGFiltersStep>[]>;
    caption: string;
    emptyText: string;
}) => (
    <div class={styles.stepColumn}>
        <div class={styles.stepCaption}>{props.caption}</div>

        <Sortable
            groupId={GROUP_ID}
            ariaLabel={props.caption}
            dir={() => "column"}
            sizing={"fill"}
            gap={STEP_LIST_GAP}
            minHeight={STEP_LIST_MIN_HEIGHT}
            itemsSignal={props.itemsSignal}
            computeItemKey={computeStepKey}
            computeItemLabel={computeStepLabel}
            renderItem={renderStep}
            renderCarried={(getItem) => renderStep(getItem, () => RESTING_FLAGS)}
            renderMarker={(getDir) => <PageSortableMarker dir={getDir} />}
            renderDecoration={(getFlags) => <PageSortableSurface flags={getFlags} emptyText={props.emptyText} />}
        />
    </div>
);

export const StackExample = (props: Props) => {
    const [getApplied] = props.appliedSignal;

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
                <StepList itemsSignal={props.appliedSignal} caption={"Applied"} emptyText={"Nothing applied"} />

                <StepList itemsSignal={props.unusedSignal} caption={"Left out"} emptyText={"Drop here"} />
            </div>
        </div>
    );
};
