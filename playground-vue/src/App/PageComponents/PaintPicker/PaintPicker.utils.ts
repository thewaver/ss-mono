import { computed, shallowRef } from "vue";

import { STARTING_KEYS } from "./PaintPicker.const";
import type { PaintKind, PaintSampleKey, PaintSampleKind, PaintSlot } from "./PaintPicker.types";

type ConfigDefs = Record<string, Record<string, number | boolean>>;

export const usePaintSlot = (
    startingKind: PaintKind,
    startingKeys?: Partial<Record<PaintSampleKind, PaintSampleKey>>,
): PaintSlot => {
    const kind = shallowRef<PaintKind>(startingKind);
    const keys = shallowRef<Record<PaintSampleKind, PaintSampleKey>>({ ...STARTING_KEYS, ...startingKeys });
    const configDefs = shallowRef<ConfigDefs>({});

    const key = computed(() => (kind.value === "none" ? STARTING_KEYS.timed : keys.value[kind.value]));

    return {
        paint: computed(() => ({ kind: kind.value, key: key.value, configDefs: configDefs.value[key.value] ?? {} })),
        setKind: (next) => {
            kind.value = next;
        },
        setKey: (next) => {
            if (kind.value !== "none") keys.value = { ...keys.value, [kind.value]: next };
        },
        setConfigDef: (name, value) => {
            configDefs.value = {
                ...configDefs.value,
                [key.value]: { ...configDefs.value[key.value], [name]: value },
            };
        },
    };
};
