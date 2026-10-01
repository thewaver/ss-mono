import { createEffect, createMemo, onCleanup } from "solid-js";

import { IMAGE_SWITCHER_DEFAULTS, ImageSwitcherUtils, ImageSwitcherStyles as styles } from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { ImageSwitcherProps } from "./ImageSwitcherSolid.types";

export const ImageSwitcher = (props: ImageSwitcherProps) => {
    const switcher = ImageSwitcherUtils.createSwitcher();

    const getState = accessStore(switcher.store);

    const getLayers = createMemo(() => ImageSwitcherUtils.getLayers(getState()));

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? IMAGE_SWITCHER_DEFAULTS.transitionDurationMs,
    );

    createEffect(() => {
        const cancel = switcher.show(access(props.src), { onLoad: props.onLoad, onError: props.onError });

        if (cancel) onCleanup(cancel);
    });

    return (
        <div class={styles.imageSwitcherRoot}>
            {[0, 1].map((index) => (
                <img
                    class={styles.imageSwitcherImage}
                    style={{
                        "opacity": getLayers()[index].isShown ? 1 : 0,
                        "transition-duration": `${getTransitionDurationMs()}ms`,
                        "visibility": getLayers()[index].src ? undefined : "hidden",
                    }}
                    src={getLayers()[index].src}
                    alt={access(props.alt) ?? ""}
                />
            ))}
        </div>
    );
};
