import { ImageSwitcher } from "@thewaver/ss-components-react";
import type { ImageSwitcherProps } from "@thewaver/ss-components-react";

export const DefaultExample = (props: ImageSwitcherProps) => {
    return (
        <ImageSwitcher
            src={props.src}
            alt={props.alt}
            transitionDurationMs={props.transitionDurationMs}
            onLoad={props.onLoad}
        />
    );
};
