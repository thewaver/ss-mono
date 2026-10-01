import { useEffect, useState } from "react";

import { IMAGE_SWITCHER_DEFAULTS, ImageSwitcherStyles, ImageSwitcherUtils } from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ImageSwitcherProps } from "./ImageSwitcher.types";

export const ImageSwitcher = (props: ImageSwitcherProps) => {
    const [switcher] = useState(ImageSwitcherUtils.createSwitcher);

    const state = useStore(switcher.store);
    const layers = ImageSwitcherUtils.getLayers(state);

    const latest = useLatest(props);

    const transitionDurationMs = props.transitionDurationMs ?? IMAGE_SWITCHER_DEFAULTS.transitionDurationMs;

    useEffect(
        () =>
            switcher.show(props.src, {
                onLoad: function (e) {
                    return latest.current.onLoad?.call(this, e);
                },
                onError: (e) => latest.current.onError?.(e),
            }),
        [switcher, props.src],
    );

    return (
        <div className={ImageSwitcherStyles.imageSwitcherRoot}>
            {layers.map((layer, index) => (
                <img
                    key={index}
                    className={ImageSwitcherStyles.imageSwitcherImage}
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
