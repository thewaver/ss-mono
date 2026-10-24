import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseButtonCounterExampleCbs,
    BaseButtonCounterExampleValues,
    BaseButtonDocsExampleValues,
    BaseButtonExampleCbs,
    BaseButtonPressedExampleValues,
    BaseButtonTooltipDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.types";

export type { ButtonCopyExampleProps } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.types";

export type ButtonExampleProps = BaseButtonExampleCbs;

export type ButtonPressedExampleProps = ButtonExampleProps & AccessorValues<BaseButtonPressedExampleValues>;

export type ButtonDocsExampleProps = AccessorValues<BaseButtonDocsExampleValues>;

export type ButtonTooltipDocsExampleProps = AccessorValues<BaseButtonTooltipDocsExampleValues>;

export type ButtonCounterExampleProps = AccessorValues<BaseButtonCounterExampleValues> & BaseButtonCounterExampleCbs;
