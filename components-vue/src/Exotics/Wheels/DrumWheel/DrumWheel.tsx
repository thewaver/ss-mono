import { type SlotsType, defineComponent } from "vue";

import { Wheel } from "../../../Primitives/Wheel/Wheel";
import type { DrumWheelProps, DrumWheelSlots } from "../../../Primitives/Wheel/Wheel.types";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";

export const DrumWheel = defineComponent(
    <T,>(props: DrumWheelProps<T>, { slots }: SlotsContext<DrumWheelSlots<T>>) => {
        const targetIndex = useTwoWay(props, "targetIndex", 0);
        const autoSpin = useTwoWay(props, "autoSpin");

        return () => (
            <Wheel
                {...{
                    ...forwardProps(props, Wheel),
                    "targetIndex": targetIndex.value,
                    "onUpdate:targetIndex": (index: number) => {
                        targetIndex.value = index;
                    },
                    "autoSpin": autoSpin.value,
                    "onUpdate:autoSpin": (isAutoSpinning: boolean) => {
                        autoSpin.value = isAutoSpinning;
                    },
                }}
                variant="drum"
            >
                {
                    {
                        renderWedge: slots.renderWedge,
                        renderWedgeBack: slots.renderWedgeBack,
                    } satisfies Partial<DrumWheelSlots<T>>
                }
            </Wheel>
        );
    },
    {
        name: "DrumWheel",
        slots: Object as SlotsType<DrumWheelSlots<any>>,
        props: declareProps<DrumWheelProps<unknown>>({
            "ariaLabel": null,
            "isDisabled": Boolean,
            "spinDurationMs": null,
            "settleDurationMs": null,
            "restDurationMs": null,
            "computeWedgeLabel": null,
            "roleDescription": null,
            "wedgeRoleDescription": null,
            "wedges": null,
            "idleDelayMs": null,
            "targetIndex": null,
            "onUpdate:targetIndex": null,
            "autoSpin": Boolean,
            "onUpdate:autoSpin": null,
            "computeSpinTarget": null,
            "computeSpinDefs": null,
            "onSelectedWedgeChange": null,
            "onSpinEnd": null,
            "onMount": null,
            "axis": null,
            "wedgeSize": null,
        }),
    },
);
