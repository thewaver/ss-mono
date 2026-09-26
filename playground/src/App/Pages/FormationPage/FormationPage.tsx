import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import {
    FORMATION_DEFAULTS,
    PlacementLayoutDefaults,
    PlacementLayouts,
    ProximityEffectDefaults,
    ProximityEffects,
} from "@thewaver/ss-components";
import type { PlacementLayoutEntry, ProximityEffectEntry } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import { FormationKnobs } from "../../Knobs/Formations.const";
import { PlacementLayoutKnobs } from "../../Knobs/PlacementLayouts.const";
import { ProximityEffectKnobs } from "../../Knobs/ProximityEffects.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { NO_SAMPLE_KEY } from "../../PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.types";
import { DefaultExample } from "./Examples/Default";
import type { FormationExampleProps } from "./FormationPage.types";

const FIELD_WIDTH = 130;
const FORMATION_WIDTH = 380;
const EXAMPLES_ROOT = "/src/App/Pages/FormationPage/Examples";

const NAMES = [
    "Aurora",
    "Basalt",
    "Cinder",
    "Drift",
    "Ember",
    "Fathom",
    "Glimmer",
    "Hollow",
    "Iris",
    "Jetty",
    "Kelp",
    "Loam",
];

const DefaultExampleWrapper = (props: FormationExampleProps) => {
    return (
        <PageMeasureBox width={() => FORMATION_WIDTH}>
            <DefaultExample {...props} />
        </PageMeasureBox>
    );
};

export const FormationPage = () => {
    const [getItemCount, setItemCount] = createSignal(FormationKnobs.STARTING_ITEM_COUNT);
    const [getSkippedCount, setSkippedCount] = createSignal(FormationKnobs.MIN_SKIPPED_COUNT);
    const [getLayoutKey, setLayoutKey] = createSignal<PlacementLayouts.SampleKey>(FormationKnobs.STARTING_LAYOUT_KEY);
    const [getEffectKey, setEffectKey] = createSignal<WithNoSample<ProximityEffects.SampleKey>>(
        FormationKnobs.STARTING_EFFECT_KEY,
    );
    const [getShapeKind, setShapeKind] = createSignal<ShapeConst.DefaultShape>(FormationKnobs.STARTING_SHAPE_KIND);
    const [getIsStackedInReverse, setIsStackedInReverse] = createSignal(FormationKnobs.STARTING_IS_STACKED_IN_REVERSE);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(FORMATION_DEFAULTS.transitionDurationMs);
    const [getStaggerMs, setStaggerMs] = createSignal(FORMATION_DEFAULTS.staggerMs);
    const [layoutDefs, setLayoutDefs] = createStore<Record<string, Record<string, number | boolean>>>({});
    const [effectDefs, setEffectDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getFamily = () => PlacementLayouts.SAMPLE_LAYOUTS[getLayoutKey()].family;
    const getKnobs = () => PlacementLayoutKnobs.KNOBS_BY_FAMILY[getFamily()] as Record<string, Knob>;
    const getDefaults = () => PlacementLayoutDefaults.DEFAULTS_BY_FAMILY[getFamily()] as Record<string, unknown>;
    const getDefs = () => layoutDefs[getLayoutKey()] ?? {};

    const getLayoutEntry = createMemo(
        () => ({ family: getFamily(), defs: getDefs() }) as unknown as PlacementLayoutEntry,
    );

    const getEffectFamily = () => {
        const key = getEffectKey();

        return key === NO_SAMPLE_KEY ? undefined : ProximityEffects.SAMPLE_EFFECTS[key].family;
    };

    const getEffectKnobs = () => {
        const family = getEffectFamily();

        return (family === undefined ? {} : ProximityEffectKnobs.KNOBS_BY_FAMILY[family]) as Record<string, Knob>;
    };

    const getEffectDefaults = () => {
        const family = getEffectFamily();

        return (family === undefined ? {} : ProximityEffectDefaults.DEFAULTS_BY_FAMILY[family]) as Record<
            string,
            unknown
        >;
    };

    const getPickedEffectDefs = () => effectDefs[getEffectKey()] ?? {};

    const getEffectEntry = createMemo(() => {
        const family = getEffectFamily();

        return family === undefined
            ? undefined
            : ({ family, defs: getPickedEffectDefs() } as unknown as ProximityEffectEntry);
    });

    const getItems = createMemo(() => NAMES.slice(getSkippedCount(), getSkippedCount() + getItemCount()));

    const getExamples = createMemo(() => {
        const commonProps: FormationExampleProps = {
            items: getItems,
            isStackedInReverse: getIsStackedInReverse,
            layoutEntry: getLayoutEntry,
            effectEntry: getEffectEntry,
            shapeKind: getShapeKind,
            transitionDurationMs: getTransitionDurationMs,
            staggerMs: getStaggerMs,
        };

        return [
            {
                key: "default",
                name: "Default",
                component: () => <DefaultExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        key={"layoutKey"}
                        label={"Arrangement"}
                        hint={
                            "How the items are arranged: a ring, an arc, a row, a honeycomb, and so on. Choosing one brings its own knobs with it."
                        }
                    >
                        <PageSelectField
                            value={getLayoutKey}
                            values={() => PlacementLayouts.SAMPLE_KEYS}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Arrangement"}
                            onChange={(key) => setLayoutKey(() => key)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={getKnobs}
                        defaults={getDefaults}
                        values={getDefs}
                        width={() => FIELD_WIDTH}
                        onInput={(key, value) =>
                            setLayoutDefs(getLayoutKey(), (previous) => ({ ...previous, [key]: value }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        key={"effectKey"}
                        label={"Pointer effect"}
                        hint={"What the items do as the pointer nears them. Choosing one brings its own knobs with it."}
                    >
                        <PageSelectField
                            value={getEffectKey}
                            values={() => FormationKnobs.EFFECT_KEYS}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Pointer effect"}
                            onChange={(key) => setEffectKey(() => key)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={getEffectKnobs}
                        defaults={getEffectDefaults}
                        values={getPickedEffectDefs}
                        width={() => FIELD_WIDTH}
                        onInput={(key, value) =>
                            setEffectDefs(getEffectKey(), (previous) => ({ ...previous, [key]: value }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp key={"itemCount"} label={"Items"} hint={"How many items the arrangement holds."}>
                        <PageNumberField
                            value={getItemCount}
                            min={() => FormationKnobs.MIN_ITEM_COUNT}
                            max={() => FormationKnobs.MAX_ITEM_COUNT}
                            step={() => FormationKnobs.ITEM_COUNT_STEP}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Items"}
                            onInput={setItemCount}
                        />
                    </PageProp>

                    <PageProp
                        key={"skippedCount"}
                        label={"Skip from the start"}
                        hint={
                            "Leaves out that many items from the front of the list, so an item can be taken out from the start rather than the end."
                        }
                    >
                        <PageNumberField
                            value={getSkippedCount}
                            min={() => FormationKnobs.MIN_SKIPPED_COUNT}
                            max={() => NAMES.length - FormationKnobs.MIN_ITEM_COUNT}
                            step={() => FormationKnobs.ITEM_COUNT_STEP}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Skip from the start"}
                            onInput={setSkippedCount}
                        />
                    </PageProp>

                    <PageProp
                        key={"isStackedInReverse"}
                        label={"Earlier items in front"}
                        hint={
                            "Puts the first item on top of the pile instead of the last, which shows where two items overlap."
                        }
                    >
                        <PageCheckField
                            value={getIsStackedInReverse}
                            ariaLabel={"Earlier items in front"}
                            onChange={setIsStackedInReverse}
                        />
                    </PageProp>

                    <PageProp key={"shapeKind"} label={"Item shape"} hint={"The outline each item is cut to."}>
                        <PageSelectField
                            value={getShapeKind}
                            values={() => ShapeConst.DEFAULT_SHAPES}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Item shape"}
                            onChange={(shape) => setShapeKind(() => shape)}
                        />
                    </PageProp>

                    <PageProp
                        key={"transitionDurationMs"}
                        label={"Glide (ms)"}
                        hint={
                            "How long an item takes to glide to its new place when the arrangement, the item count or a knob changes. At 0 it moves at once, and under reduced motion it always does."
                        }
                    >
                        <PageNumberField
                            value={getTransitionDurationMs}
                            min={() => FormationKnobs.MIN_DURATION_MS}
                            max={() => FormationKnobs.MAX_DURATION_MS}
                            step={() => FormationKnobs.DURATION_STEP_MS}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Glide duration in milliseconds"}
                            onInput={setTransitionDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        key={"staggerMs"}
                        label={"Stagger (ms)"}
                        hint={"How much later each item sets off than the one before it, while gliding is on."}
                    >
                        <PageNumberField
                            value={getStaggerMs}
                            min={() => FormationKnobs.MIN_STAGGER_MS}
                            max={() => FormationKnobs.MAX_STAGGER_MS}
                            step={() => FormationKnobs.STAGGER_STEP_MS}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Stagger in milliseconds"}
                            onInput={setStaggerMs}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
