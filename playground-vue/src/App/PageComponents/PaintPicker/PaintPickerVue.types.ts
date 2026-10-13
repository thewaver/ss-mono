import type { Ref } from "vue";

import type { PaintKind, PaintSampleKey } from "@thewaver/ss-playground/App/PageComponents/PaintPicker/PaintKind.types";
import type { Paint } from "@thewaver/ss-playground/App/PageComponents/PaintPicker/PaintPicker.types";

export type { Paint, PaintSettings } from "@thewaver/ss-playground/App/PageComponents/PaintPicker/PaintPicker.types";

export type {
    PaintKind,
    PaintSampleKey,
    PaintSampleKind,
} from "@thewaver/ss-playground/App/PageComponents/PaintPicker/PaintKind.types";

export type PaintSlot = {
    paint: Readonly<Ref<Paint>>;
    setKind: (kind: PaintKind) => void;
    setKey: (key: PaintSampleKey) => void;
    setConfigDef: (name: string, value: number | boolean) => void;
};

export type PagePaintPickerProps = {
    paintSlot: PaintSlot;
    name: string;
    label: string;
    hint: string;
};
