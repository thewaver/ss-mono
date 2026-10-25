import { type SlotsType, defineComponent, shallowRef, useId } from "vue";

import { LABEL_DEFAULTS, LabelStyles } from "@thewaver/ss-components";

import { declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { provideLabelContext, useLabelContext } from "./Label.context";
import type { LabelProps, LabelSlots } from "./Label.types";

export const Label = defineComponent(
    (props: LabelProps, { slots }: SlotsContext<LabelSlots>) => {
        const context = useLabelContext();
        const labelId = useId();
        const isNested = context.getIsLabeled();
        const registeredControlId = shallowRef<string>();
        const registeredCaptionId = shallowRef<string>();

        provideLabelContext({
            getIsLabeled: () => true,
            getLabelId: () => (isNested ? context.getLabelId() : labelId),
            setControlId: (id) => {
                if (isNested) {
                    context.setControlId(id);

                    return;
                }

                registeredControlId.value = id;
            },
            getCaptionId: () => (isNested ? context.getCaptionId() : registeredCaptionId.value),
            setCaptionId: (id) => {
                if (isNested) {
                    context.setCaptionId(id);

                    return;
                }

                registeredCaptionId.value = id;
            },
        });

        return () => {
            const Element = isNested ? "div" : "label";
            const orientation = props.orientation ?? LABEL_DEFAULTS.orientation;

            return (
                <Element
                    id={isNested ? undefined : labelId}
                    for={isNested ? undefined : (props.for ?? registeredControlId.value)}
                    class={LabelStyles.labelRoot}
                    style={{
                        flexDirection: orientation === "horizontal" ? "row" : "column",
                        gap: `${props.gap ?? LABEL_DEFAULTS.gap}px`,
                    }}
                >
                    {slots.default?.()}
                </Element>
            );
        };
    },
    {
        name: "Label",
        slots: Object as SlotsType<LabelSlots>,
        props: declareProps<LabelProps>({ orientation: null, gap: null, for: null }),
    },
);
