import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseSlideButtonErroredExampleCbs,
    BaseSlideButtonErroredExampleValues,
    BaseSlideButtonHeldExampleCbs,
    BaseSlideButtonHeldExampleValues,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.types";

export type { SlideButtonExampleProps } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.types";

export type SlideButtonHeldExampleProps = AccessorValues<BaseSlideButtonHeldExampleValues> &
    BaseSlideButtonHeldExampleCbs;

export type SlideButtonErroredExampleProps = AccessorValues<BaseSlideButtonErroredExampleValues> &
    BaseSlideButtonErroredExampleCbs;
