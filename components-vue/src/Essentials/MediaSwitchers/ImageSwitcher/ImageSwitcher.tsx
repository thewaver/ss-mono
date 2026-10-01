import { defineComponent } from "vue";

import { IMAGE_SWITCHER_DEFAULTS, ImageSwitcherStyles, ImageSwitcherUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ImageSwitcherProps } from "./ImageSwitcher.types";

export const ImageSwitcher = defineComponent(
    (props: ImageSwitcherProps) => {
        const switcher = ImageSwitcherUtils.createSwitcher();

        const state = useStore(switcher.store);

        watchAfterRender([() => props.src], ([src]) =>
            switcher.show(src, {
                onLoad: function (e) {
                    return props.onLoad?.call(this, e);
                },
                onError: (e) => props.onError?.(e),
            }),
        );

        return () => {
            const layers = ImageSwitcherUtils.getLayers(state.value);
            const transitionDurationMs = props.transitionDurationMs ?? IMAGE_SWITCHER_DEFAULTS.transitionDurationMs;

            return (
                <div class={ImageSwitcherStyles.imageSwitcherRoot}>
                    {layers.map((layer, index) => (
                        <img
                            key={index}
                            class={ImageSwitcherStyles.imageSwitcherImage}
                            style={{
                                opacity: layer.isShown ? 1 : 0,
                                transitionDuration: `${transitionDurationMs}ms`,
                                visibility: layer.src ? undefined : "hidden",
                            }}
                            src={layer.src}
                            alt={props.alt ?? ""}
                        />
                    ))}
                </div>
            );
        };
    },
    {
        name: "ImageSwitcher",
        props: declareProps<ImageSwitcherProps>({
            src: null,
            alt: null,
            transitionDurationMs: null,
            onLoad: null,
            onError: null,
        }),
    },
);
