import { useMemo, useState } from "react";

import {
    FORMATION_DEFAULTS,
    PlacementLayoutDefaults,
    PlacementLayouts,
    ProximityEffectDefaults,
    ProximityEffects,
} from "@thewaver/ss-components-react";
import type { PlacementLayoutEntry, ProximityEffectEntry } from "@thewaver/ss-components-react";
import { FormationKnobs } from "@thewaver/ss-playground/App/Knobs/Formations.const";
import { PlacementLayoutKnobs } from "@thewaver/ss-playground/App/Knobs/PlacementLayouts.const";
import { ProximityEffectKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityEffects.const";
import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    FORMATION_WIDTH,
    NAMES,
    NO_DEFS,
} from "@thewaver/ss-playground/App/Pages/FormationPage/FormationPage.const";
import { ShapeConst } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import type { FormationExampleProps } from "./FormationPageReact.types";

const DefaultExampleWrapper = (props: FormationExampleProps) => {
    return (
        <PageMeasureBox width={FORMATION_WIDTH}>
            <DefaultExample {...props} />
        </PageMeasureBox>
    );
};

export const FormationPage = () => {
    const [itemCount, setItemCount] = useState(FormationKnobs.STARTING_ITEM_COUNT);
    const [skippedCount, setSkippedCount] = useState(FormationKnobs.MIN_SKIPPED_COUNT);
    const [layoutKey, setLayoutKey] = useState<PlacementLayouts.SampleKey>(FormationKnobs.STARTING_LAYOUT_KEY);
    const [effectKey, setEffectKey] = useState<WithNoSample<ProximityEffects.SampleKey>>(
        FormationKnobs.STARTING_EFFECT_KEY,
    );
    const [shapeKind, setShapeKind] = useState<ShapeConst.DefaultShape>(FormationKnobs.STARTING_SHAPE_KIND);
    const [isStackedInReverse, setIsStackedInReverse] = useState(FormationKnobs.STARTING_IS_STACKED_IN_REVERSE);
    const [transitionDurationMs, setTransitionDurationMs] = useState(FORMATION_DEFAULTS.transitionDurationMs);
    const [transitionDelayMs, setTransitionDelayMs] = useState(FORMATION_DEFAULTS.transitionDelayMs);
    const [layoutDefs, setLayoutDefs] = useState<Record<string, Record<string, number | boolean>>>({});
    const [effectDefs, setEffectDefs] = useState<Record<string, Record<string, number | boolean>>>({});

    const family = PlacementLayouts.SAMPLE_LAYOUTS[layoutKey].family;
    const knobs = PlacementLayoutKnobs.KNOBS_BY_FAMILY[family] as Record<string, Knob>;
    const defaults = PlacementLayoutDefaults.DEFAULTS_BY_FAMILY[family] as Record<string, unknown>;
    const defs = layoutDefs[layoutKey] ?? NO_DEFS;

    const layoutEntry = useMemo(() => ({ family, defs }) as unknown as PlacementLayoutEntry, [family, defs]);

    const effectFamily = effectKey === NO_SAMPLE_KEY ? undefined : ProximityEffects.SAMPLE_EFFECTS[effectKey].family;

    const effectKnobs = (
        effectFamily === undefined ? {} : ProximityEffectKnobs.KNOBS_BY_FAMILY[effectFamily]
    ) as Record<string, Knob>;

    const effectDefaults = (
        effectFamily === undefined ? {} : ProximityEffectDefaults.DEFAULTS_BY_FAMILY[effectFamily]
    ) as Record<string, unknown>;

    const pickedEffectDefs = effectDefs[effectKey] ?? NO_DEFS;

    const effectEntry = useMemo(
        () =>
            effectFamily === undefined
                ? undefined
                : ({ family: effectFamily, defs: pickedEffectDefs } as unknown as ProximityEffectEntry),
        [effectFamily, pickedEffectDefs],
    );

    const items = useMemo(() => NAMES.slice(skippedCount, skippedCount + itemCount), [skippedCount, itemCount]);

    const commonProps: FormationExampleProps = {
        items,
        isStackedInReverse,
        layoutEntry,
        effectEntry,
        shapeKind,
        transitionDurationMs,
        transitionDelayMs,
    };

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            component: () => <DefaultExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ];

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        itemKey={"layoutKey"}
                        label={"Arrangement"}
                        hint={
                            "How the items are arranged: a ring, an arc, a row, a honeycomb, and so on. Choosing one brings its own knobs with it."
                        }
                        controls={"Picks the sample layout sent to FormationProps.computeLayout"}
                    >
                        <PageSelectField
                            value={layoutKey}
                            values={PlacementLayouts.SAMPLE_KEYS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Arrangement"}
                            onChange={setLayoutKey}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={knobs}
                        defaults={defaults}
                        values={defs}
                        width={FIELD_WIDTH}
                        onInput={(key, value) =>
                            setLayoutDefs((previous) => ({
                                ...previous,
                                [layoutKey]: { ...previous[layoutKey], [key]: value },
                            }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        itemKey={"effectKey"}
                        label={"Pointer effect"}
                        hint={"What the items do as the pointer nears them. Choosing one brings its own knobs with it."}
                        controls={"Picks the sample effect sent to FormationProps.computeEffect"}
                    >
                        <PageSelectField
                            value={effectKey}
                            values={FormationKnobs.EFFECT_KEYS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Pointer effect"}
                            onChange={setEffectKey}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={effectKnobs}
                        defaults={effectDefaults}
                        values={pickedEffectDefs}
                        width={FIELD_WIDTH}
                        onInput={(key, value) =>
                            setEffectDefs((previous) => ({
                                ...previous,
                                [effectKey]: { ...previous[effectKey], [key]: value },
                            }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp
                        itemKey={"itemCount"}
                        label={"Items"}
                        hint={"How many items the arrangement holds."}
                        controls={"Sets the length of the slice of example items sent to FormationProps.items"}
                    >
                        <PageNumberField
                            value={itemCount}
                            min={FormationKnobs.MIN_ITEM_COUNT}
                            max={FormationKnobs.MAX_ITEM_COUNT}
                            step={FormationKnobs.ITEM_COUNT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Items"}
                            onInput={setItemCount}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"skippedCount"}
                        label={"Skip from the start"}
                        hint={
                            "Leaves out that many items from the front of the list, so an item can be taken out from the start rather than the end."
                        }
                        controls={"Sets where the slice of example items sent to FormationProps.items starts"}
                    >
                        <PageNumberField
                            value={skippedCount}
                            min={FormationKnobs.MIN_SKIPPED_COUNT}
                            max={NAMES.length - FormationKnobs.MIN_ITEM_COUNT}
                            step={FormationKnobs.ITEM_COUNT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Skip from the start"}
                            onInput={setSkippedCount}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"isStackedInReverse"}
                        label={"Earlier items in front"}
                        hint={
                            "Puts the first item on top of the pile instead of the last, which shows where two items overlap."
                        }
                        controls={"Sets FormationProps.isStackedInReverse"}
                    >
                        <PageCheckField
                            value={isStackedInReverse}
                            ariaLabel={"Earlier items in front"}
                            onChange={setIsStackedInReverse}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"shapeKind"}
                        label={"Item shape"}
                        hint={"The contour each item is cut to."}
                        controls={"Picks the contour of the example items drawn by FormationProps.renderItem"}
                    >
                        <PageSelectField
                            value={shapeKind}
                            values={ShapeConst.DEFAULT_SHAPES}
                            width={FIELD_WIDTH}
                            ariaLabel={"Item shape"}
                            onChange={setShapeKind}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"transitionDurationMs"}
                        label={"Glide (ms)"}
                        hint={
                            "How long an item takes to glide to its new place when the arrangement, the item count or a knob changes. At 0 it moves at once, and under reduced motion it always does."
                        }
                        controls={"Sets FormationProps.transitionDurationMs"}
                    >
                        <PageNumberField
                            value={transitionDurationMs}
                            min={FormationKnobs.MIN_DURATION_MS}
                            max={FormationKnobs.MAX_DURATION_MS}
                            step={FormationKnobs.DURATION_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Glide duration in milliseconds"}
                            onInput={setTransitionDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"transitionDelayMs"}
                        label={"Transition delay (ms)"}
                        hint={"How much later each item sets off than the one before it, while gliding is on."}
                        controls={"Sets FormationProps.transitionDelayMs"}
                    >
                        <PageNumberField
                            value={transitionDelayMs}
                            min={FormationKnobs.MIN_STAGGER_MS}
                            max={FormationKnobs.MAX_STAGGER_MS}
                            step={FormationKnobs.STAGGER_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Transition delay in milliseconds"}
                            onInput={setTransitionDelayMs}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
