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
        <PageMeasureBox width={props.width}>
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
    const [widths, setWidths] = useState<Partial<Record<PlacementLayouts.SampleKey, number>>>({});

    const family = PlacementLayouts.SAMPLE_LAYOUTS[layoutKey].family;
    const knobs = PlacementLayoutKnobs.KNOBS_BY_FAMILY[family] as Record<string, Knob>;
    const defaults = PlacementLayoutDefaults.DEFAULTS_BY_FAMILY[family] as Record<string, unknown>;
    const defs = layoutDefs[layoutKey] ?? NO_DEFS;
    const width = widths[layoutKey] ?? FormationKnobs.STARTING_WIDTHS[layoutKey];

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
        width,
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
                    <PageProp itemKey={"layoutKey"} {...FormationKnobs.LAYOUT_KEY_TEXT}>
                        <PageSelectField
                            value={layoutKey}
                            values={PlacementLayouts.SAMPLE_KEYS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Arrangement"}
                            onChange={setLayoutKey}
                        />
                    </PageProp>

                    <PageProp itemKey={"width"} {...FormationKnobs.WIDTH_TEXT}>
                        <PageNumberField
                            key={layoutKey}
                            value={width}
                            min={FormationKnobs.MIN_WIDTH}
                            max={FormationKnobs.MAX_WIDTH}
                            step={FormationKnobs.WIDTH_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Width in pixels"}
                            onInput={(next) => setWidths((previous) => ({ ...previous, [layoutKey]: next }))}
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
                    <PageProp itemKey={"effectKey"} {...FormationKnobs.EFFECT_KEY_TEXT}>
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
                    <PageProp itemKey={"itemCount"} {...FormationKnobs.ITEM_COUNT_TEXT}>
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

                    <PageProp itemKey={"skippedCount"} {...FormationKnobs.SKIPPED_COUNT_TEXT}>
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

                    <PageProp itemKey={"isStackedInReverse"} {...FormationKnobs.IS_STACKED_IN_REVERSE_TEXT}>
                        <PageCheckField
                            value={isStackedInReverse}
                            ariaLabel={"Earlier items in front"}
                            onChange={setIsStackedInReverse}
                        />
                    </PageProp>

                    <PageProp itemKey={"shapeKind"} {...FormationKnobs.SHAPE_KIND_TEXT}>
                        <PageSelectField
                            value={shapeKind}
                            values={ShapeConst.DEFAULT_SHAPES}
                            width={FIELD_WIDTH}
                            ariaLabel={"Item shape"}
                            onChange={setShapeKind}
                        />
                    </PageProp>

                    <PageProp itemKey={"transitionDurationMs"} {...FormationKnobs.TRANSITION_DURATION_MS_TEXT}>
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

                    <PageProp itemKey={"transitionDelayMs"} {...FormationKnobs.TRANSITION_DELAY_MS_TEXT}>
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
