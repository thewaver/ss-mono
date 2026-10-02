import { STARTING_KEYS } from "./PaintPicker.const";
import type { PaintKind, PaintSampleKey, PaintSampleKind, PaintSlot } from "./PaintPicker.types";

type ConfigDefs = Record<string, Record<string, number | boolean>>;

export const createPaintSlot = (
    startingKind: PaintKind,
    startingKeys?: Partial<Record<PaintSampleKind, PaintSampleKey>>,
): PaintSlot => {
    let kind = $state<PaintKind>(startingKind);
    let keys = $state.raw<Record<PaintSampleKind, PaintSampleKey>>({ ...STARTING_KEYS, ...startingKeys });
    let configDefs = $state.raw<ConfigDefs>({});

    const key = $derived(kind === "none" ? STARTING_KEYS.timed : keys[kind]);
    const paint = $derived({ kind, key, configDefs: configDefs[key] ?? {} });

    return {
        get paint() {
            return paint;
        },
        setKind: (next) => {
            kind = next;
        },
        setKey: (next) => {
            if (kind !== "none") keys = { ...keys, [kind]: next };
        },
        setConfigDef: (name, value) => {
            configDefs = { ...configDefs, [key]: { ...configDefs[key], [name]: value } };
        },
    };
};
