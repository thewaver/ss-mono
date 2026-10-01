import { type SlotsType, defineComponent } from "vue";

import { Spotlight } from "../../../../Primitives/Spotlight/Spotlight";
import type {
    SpotlightPromptProps,
    SpotlightProps,
    SpotlightSlots,
} from "../../../../Primitives/Spotlight/Spotlight.types";
import { declareProps, forwardProps, useTwoWay } from "../../../../Utils/propUtils";
import type { SlotsContext } from "../../../../Utils/typeUtils";

export const SpotlightPrompt = defineComponent(
    (props: SpotlightPromptProps, { slots }: SlotsContext<SpotlightSlots>) => {
        const visibility = useTwoWay(props, "visibility", false);

        return () => {
            const spotlightProps: SpotlightProps = {
                ...forwardProps(props, Spotlight),
                "elementRef": props.elementRef,
                "mode": "prompt",
                "visibility": visibility.value,
                "onUpdate:visibility": (isVisible: boolean) => {
                    visibility.value = isVisible;
                },
            };

            return (
                <Spotlight {...spotlightProps}>
                    {
                        {
                            renderHighlight: slots.renderHighlight,
                            renderOverlay: slots.renderOverlay,
                        } satisfies Partial<SpotlightSlots>
                    }
                </Spotlight>
            );
        };
    },
    {
        name: "SpotlightPrompt",
        inheritAttrs: false,
        slots: Object as SlotsType<SpotlightSlots>,
        props: declareProps<SpotlightPromptProps>({
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "padding": null,
            "transitionDurationMs": null,
            "elementRef": null,
            "onShow": null,
            "onHide": null,
        }),
    },
);
