import type { Signal } from "solid-js";

import type { AccessorValues } from "@thewaver/ss-components-solid";
import type { BaseRGBAnimationExampleValues } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

export type RGBAnimationExampleProps = AccessorValues<BaseRGBAnimationExampleValues> & {
    playback: Signal<boolean>;
    progress: Signal<number>;
};
