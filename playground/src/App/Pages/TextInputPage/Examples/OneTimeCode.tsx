import { TextInput, TextSyncUtils } from "@thewaver/ss-components";

import { PagePinCellsContent } from "../../../StyledComponents/PinCellsContent/PinCellsContent";
import { PIN_LENGTH, PIN_MASK } from "../TextInputPage.const";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const OneTimeCodeExample = (props: Props) => (
    <TextInput
        valueSignal={props.valueSignal}
        ariaLabel={"One-time code"}
        autoComplete={"one-time-code"}
        inputMode={"numeric"}
        computeMaskedText={(previous, next, caret) => TextSyncUtils.applyMask(PIN_MASK, previous, next, caret)}
        computeTextStyle={() => ({ "color": "transparent", "caret-color": "transparent" })}
        renderContent={(getFlags) => (
            <PagePinCellsContent flags={getFlags} value={() => props.valueSignal[0]()} length={PIN_LENGTH} />
        )}
    />
);
