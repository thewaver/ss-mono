import { type SlotsType, defineComponent } from "vue";

import { Spotlight } from "../../../../Primitives/Spotlight/Spotlight";
import type {
    SpotlightGuideProps,
    SpotlightGuideSlots,
    SpotlightProps,
} from "../../../../Primitives/Spotlight/Spotlight.types";
import { declareProps, forwardProps, useTwoWay } from "../../../../Utils/propUtils";
import type { SlotsContext } from "../../../../Utils/typeUtils";

export const SpotlightGuide = defineComponent(
    (props: SpotlightGuideProps, { slots }: SlotsContext<SpotlightGuideSlots>) => {
        const visibility = useTwoWay(props, "visibility", false);

        return () => {
            const spotlightProps: SpotlightProps = {
                ...forwardProps(props, Spotlight),
                "elementRef": props.elementRef,
                "mode": "guide",
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
                            renderPopup: slots.renderPopup,
                        } satisfies Partial<SpotlightGuideSlots>
                    }
                </Spotlight>
            );
        };
    },
    {
        name: "SpotlightGuide",
        inheritAttrs: false,
        slots: Object as SlotsType<SpotlightGuideSlots>,
        props: declareProps<SpotlightGuideProps>({
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "padding": null,
            "transitionDurationMs": null,
            "elementRef": null,
            "onShow": null,
            "onHide": null,
            "ariaLabel": null,
            "announcement": null,
            "popupPlacement": null,
            "popupOffset": null,
        }),
    },
);
