import { useState } from "react";

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

export const usePaintSlot = (
    startingKind: PaintKind,
    startingKeys?: Partial<Record<PaintSampleKind, PaintSampleKey>>,
): PaintSlot => {
    const [kind, setKind] = useState<PaintKind>(startingKind);
    const [keys, setKeys] = useState<Record<PaintSampleKind, PaintSampleKey>>({ ...STARTING_KEYS, ...startingKeys });
    const [configDefs, setConfigDefs] = useState<ConfigDefs>({});

    const key = kind === "solid" ? STARTING_KEYS.timed : keys[kind];

    return {
        paint: { kind, key, configDefs: configDefs[key] ?? {} },
        setKind,
        setKey: (next) => {
            if (kind !== "solid") setKeys((previous) => ({ ...previous, [kind]: next }));
        },
        setConfigDef: (name, value) =>
            setConfigDefs((previous) => ({ ...previous, [key]: { ...previous[key], [name]: value } })),
    };
};

export const PagePaintPicker = (props: PagePaintPickerProps) => {
    const { kind, key, configDefs } = props.paintSlot.paint;

    return (
        <PagePropsPanel scope={"sample"}>
            <PageProp itemKey={`${props.name}Kind`} label={props.label} hint={props.hint}>
                <PageSelectField
                    value={kind}
                    values={PAINT_KINDS}
                    computeLabel={(value) => PAINT_KIND_LABELS[value]}
                    ariaLabel={props.label}
                    onChange={props.paintSlot.setKind}
                />
            </PageProp>

            {kind !== "solid" && (
                <PageProp
                    key={kind}
                    itemKey={`${props.name}Key`}
                    label={PAINT_KIND_LABELS[kind]}
                    hint={"Which sample paints it. Choosing one brings its own knobs with it."}
                >
                    <PageGroupedSelectField
                        value={key}
                        groups={SAMPLE_GROUPS[kind]}
                        ariaLabel={`${props.label} ${PAINT_KIND_LABELS[kind].toLowerCase()}`}
                        onChange={props.paintSlot.setKey}
                    />
                </PageProp>
            )}

            <PageKnobs
                knobs={getPaintKnobs(kind, key)}
                defaults={getPaintDefaults(kind, key)}
                values={configDefs}
                onInput={props.paintSlot.setConfigDef}
            />
        </PagePropsPanel>
    );
};
