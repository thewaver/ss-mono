import { ImageSwitcher } from "@thewaver/ss-components";
import type { ImageSwitcherProps } from "@thewaver/ss-components";

export const DefaultExample = (props: ImageSwitcherProps) => {
    return <ImageSwitcher src={props.src} transitionDurationMs={props.transitionDurationMs} onLoad={props.onLoad} />;
};
