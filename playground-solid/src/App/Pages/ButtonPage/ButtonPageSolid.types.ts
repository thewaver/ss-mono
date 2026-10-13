import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseButtonErroredExampleValues,
    BaseButtonExampleCbs,
    BaseButtonPressedExampleValues,
} from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.types";

export type { ButtonCopyExampleProps } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.types";

export type ButtonExampleProps = BaseButtonExampleCbs;

export type ButtonPressedExampleProps = ButtonExampleProps & AccessorValues<BaseButtonPressedExampleValues>;

export type ButtonErroredExampleProps = ButtonExampleProps & AccessorValues<BaseButtonErroredExampleValues>;
