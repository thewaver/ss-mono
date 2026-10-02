import { type InjectionKey, defineComponent, inject, provide } from "vue";

import type { Rect } from "@thewaver/ss-utils";

import type { PaintAreaContextType } from "./PaintArea.context.types";

const PAINT_AREA_CONTEXT_KEY: InjectionKey<PaintAreaContextType> = Symbol("PaintAreaContext");

export const providePaintAreaContext = (context: PaintAreaContextType) => provide(PAINT_AREA_CONTEXT_KEY, context);

export const usePaintAreaContext = (): PaintAreaContextType | undefined => inject(PAINT_AREA_CONTEXT_KEY, undefined);

export const PaintAreaProvider = defineComponent(
    (props: { getPaintArea: () => Rect | undefined }, { slots }) => {
        providePaintAreaContext({ getPaintArea: () => props.getPaintArea() });

        return () => slots.default?.();
    },
    { name: "PaintAreaProvider", props: ["getPaintArea"] },
);
