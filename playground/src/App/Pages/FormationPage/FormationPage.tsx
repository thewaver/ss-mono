import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import type { PlacementLayoutEntry, ProximityEffectEntry, SampleKnob } from "@thewaver/ss-components";
import {
    PlacementLayoutKnobs,
    PlacementLayouts,
    ProximityEffectKnobs,
    ProximityEffects,
} from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import type { FormationExampleProps } from "./FormationPage.types";

const MIN_ITEM_COUNT = 1;
const MAX_ITEM_COUNT = 12;
const ITEM_COUNT_STEP = 1;
const FIELD_WIDTH = 130;
const FORMATION_WIDTH = 380;
const EXAMPLES_ROOT = "/src/App/Pages/FormationPage/Examples";

const STARTING_ITEM_COUNT = 6;
const STARTING_LAYOUT_KEY: PlacementLayouts.SampleKey = "cliff";
const NO_EFFECT_KEY = "none";
const STARTING_EFFECT_KEY: EffectKey = "glow";
const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "hexagon-pointy-top";

type EffectKey = ProximityEffects.SampleKey | typeof NO_EFFECT_KEY;

const EFFECT_KEYS: EffectKey[] = [NO_EFFECT_KEY, ...ProximityEffects.SAMPLE_KEYS];

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
    const [getItemCount, setItemCount] = createSignal(STARTING_ITEM_COUNT);
    const [getLayoutKey, setLayoutKey] = createSignal<PlacementLayouts.SampleKey>(STARTING_LAYOUT_KEY);
    const [getEffectKey, setEffectKey] = createSignal<EffectKey>(STARTING_EFFECT_KEY);
    const [getShapeKind, setShapeKind] = createSignal<ShapeConst.DefaultShape>(STARTING_SHAPE_KIND);
    const [getIsStackedInReverse, setIsStackedInReverse] = createSignal(false);
    const [layoutDefs, setLayoutDefs] = createStore<Record<string, Record<string, number | boolean>>>({});
    const [effectDefs, setEffectDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getFamily = () => PlacementLayouts.SAMPLE_LAYOUTS[getLayoutKey()].family;
    const getKnobs = () => PlacementLayoutKnobs.KNOBS_BY_FAMILY[getFamily()] as Record<string, SampleKnob>;
    const getDefaults = () => PlacementLayoutKnobs.DEFAULTS_BY_FAMILY[getFamily()] as Record<string, unknown>;
    const getDefs = () => layoutDefs[getLayoutKey()] ?? {};

    const getLayoutEntry = createMemo(
        () => ({ family: getFamily(), defs: getDefs() }) as unknown as PlacementLayoutEntry,
    );

    const getEffectFamily = () => {
        const key = getEffectKey();

        return key === NO_EFFECT_KEY ? undefined : ProximityEffects.SAMPLE_EFFECTS[key].family;
    };

    const getEffectKnobs = () => {
        const family = getEffectFamily();

        return (family === undefined ? {} : ProximityEffectKnobs.KNOBS_BY_FAMILY[family]) as Record<string, SampleKnob>;
    };

    const getEffectDefaults = () => {
        const family = getEffectFamily();

        return (family === undefined ? {} : ProximityEffectKnobs.DEFAULTS_BY_FAMILY[family]) as Record<string, unknown>;
    };

    const getPickedEffectDefs = () => effectDefs[getEffectKey()] ?? {};

    const getEffectEntry = createMemo(() => {
        const family = getEffectFamily();

        return family === undefined
            ? undefined
            : ({ family, defs: getPickedEffectDefs() } as unknown as ProximityEffectEntry);
    });

    const getItems = createMemo(() => NAMES.slice(0, getItemCount()));

    const getExamples = createMemo(() => {
        const commonProps: FormationExampleProps = {
            items: getItems,
            isStackedInReverse: getIsStackedInReverse,
            layoutEntry: getLayoutEntry,
            effectEntry: getEffectEntry,
            shapeKind: getShapeKind,
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
                    <PageProp key={"layoutKey"} label={"Arrangement"}>
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
                    <PageProp key={"effectKey"} label={"Pointer effect"}>
                        <PageSelectField
                            value={getEffectKey}
                            values={() => EFFECT_KEYS}
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
                    <PageProp key={"itemCount"} label={"Items"}>
                        <PageNumberField
                            value={getItemCount}
                            min={() => MIN_ITEM_COUNT}
                            max={() => MAX_ITEM_COUNT}
                            step={() => ITEM_COUNT_STEP}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Items"}
                            onInput={setItemCount}
                        />
                    </PageProp>

                    <PageProp key={"isStackedInReverse"} label={"Earlier items in front"}>
                        <PageCheckField
                            value={getIsStackedInReverse}
                            ariaLabel={"Earlier items in front"}
                            onChange={setIsStackedInReverse}
                        />
                    </PageProp>

                    <PageProp key={"shapeKind"} label={"Item shape"}>
                        <PageSelectField
                            value={getShapeKind}
                            values={() => ShapeConst.DEFAULT_SHAPES}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Item shape"}
                            onChange={(shape) => setShapeKind(() => shape)}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
