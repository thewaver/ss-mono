import { defineComponent } from "vue";

import { PaintAreaUtils } from "@thewaver/ss-components";

import { usePaintAreaContext } from "../SVGGradients/PaintArea.context";

export const SVGClipPath = defineComponent(
    (props: { id: string }, { slots }) => {
        const paintArea = usePaintAreaContext();

        return () => {
            const attributes = PaintAreaUtils.computeClipPathAttributes(paintArea?.getPaintArea());

            return (
                <clipPath id={props.id} clipPathUnits={attributes.clipPathUnits} transform={attributes.transform}>
                    {slots.default?.()}
                </clipPath>
            );
        };
    },
    { name: "SVGClipPath", props: ["id"] },
);
