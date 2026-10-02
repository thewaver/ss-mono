import { Show, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { PageGroupedSelectField, PageSelectField } from "../Field/Field";
import { PageKnobs } from "../Knobs/Knobs";
import { PageProp } from "../Prop/Prop";
import { PagePropsPanel } from "../PropsPanel/PropsPanel";
import {
    PAINT_KINDS,
    PAINT_KIND_LABELS,
    SAMPLE_GROUPS,
    STARTING_KEYS,
    getPaintDefaults,
    getPaintKnobs,
} from "./PaintPicker.const";
import type { PagePaintPickerProps, PaintKind, PaintSampleKey, PaintSampleKind, PaintSlot } from "./PaintPicker.types";

type ConfigDefs = Record<string, Record<string, number | boolean>>;

export const createPaintSlot = (
    startingKind: PaintKind,
    startingKeys?: Partial<Record<PaintSampleKind, PaintSampleKey>>,
): PaintSlot => {
    const [getKind, setKind] = createSignal<PaintKind>(startingKind);
    const [keys, setKeys] = createStore<Record<PaintSampleKind, PaintSampleKey>>({ ...STARTING_KEYS, ...startingKeys });
    const [configDefs, setConfigDefs] = createStore<ConfigDefs>({});

    const getKey = () => {
        const kind = getKind();

        return kind === "none" ? STARTING_KEYS.timed : keys[kind];
    };

    const getPaint = createMemo(() => ({ kind: getKind(), key: getKey(), configDefs: configDefs[getKey()] ?? {} }));

    return {
        getPaint,
        getKind,
        setKind: (kind) => setKind(() => kind),
        getKey,
        setKey: (key) => {
            const kind = getKind();

            if (kind !== "none") setKeys(kind, key);
        },
        setConfigDef: (name, value) => setConfigDefs(getKey(), (previous) => ({ ...previous, [name]: value })),
    };
};

export const PagePaintPicker = (props: PagePaintPickerProps) => {
    const getSampleKind = () => {
        const kind = props.paintSlot.getKind();

        return kind === "none" ? undefined : kind;
    };

    return (
        <PagePropsPanel scope={"sample"}>
            <PageProp key={`${props.name}Kind`} label={props.label} hint={props.hint}>
                <PageSelectField
                    value={props.paintSlot.getKind}
                    values={() => PAINT_KINDS}
                    computeLabel={(kind) => PAINT_KIND_LABELS[kind]}
                    ariaLabel={props.label}
                    onChange={props.paintSlot.setKind}
                />
            </PageProp>

            <Show when={getSampleKind()} keyed>
                {(kind) => (
                    <PageProp
                        key={`${props.name}Key`}
                        label={PAINT_KIND_LABELS[kind]}
                        hint={"Which sample paints it. Choosing one brings its own knobs with it."}
                    >
                        <PageGroupedSelectField
                            value={props.paintSlot.getKey}
                            groups={() => SAMPLE_GROUPS[kind]}
                            ariaLabel={`${props.label} ${PAINT_KIND_LABELS[kind].toLowerCase()}`}
                            onChange={props.paintSlot.setKey}
                        />
                    </PageProp>
                )}
            </Show>

            <PageKnobs
                knobs={() => getPaintKnobs(props.paintSlot.getKind(), props.paintSlot.getKey())}
                defaults={() => getPaintDefaults(props.paintSlot.getKind(), props.paintSlot.getKey())}
                values={() => props.paintSlot.getPaint().configDefs}
                onInput={props.paintSlot.setConfigDef}
            />
        </PagePropsPanel>
    );
};
