import { type SlotsType, defineComponent } from "vue";

import { Wheel } from "../../../Primitives/Wheel/Wheel";
import type { OverheadWheelProps, WheelSlots } from "../../../Primitives/Wheel/Wheel.types";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";

export const OverheadWheel = defineComponent(
    <T,>(props: OverheadWheelProps<T>, { slots }: SlotsContext<WheelSlots<T>>) => {
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
                variant="overhead"
            >
                {{ renderWedge: slots.renderWedge } satisfies Partial<WheelSlots<T>>}
            </Wheel>
        );
    },
    {
        name: "OverheadWheel",
        slots: Object as SlotsType<WheelSlots<any>>,
        props: declareProps<OverheadWheelProps<unknown>>({
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
            "markerDegrees": null,
            "computeLayout": null,
            "computeEffect": null,
        }),
    },
);
