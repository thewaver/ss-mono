import { Index } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { PinCellsContentProps } from "./PinCellsContent.types";

import * as fieldStyles from "../TextFieldContent/TextFieldContent.css";
import * as styles from "./PinCellsContent.css";

export const PagePinCellsContent = (props: PinCellsContentProps) => {
    const getCells = () => Array.from({ length: access(props.length) }, (_unused, index) => access(props.value)[index]);

    return (
        <div class={styles.pinCellsContent} aria-hidden="true">
            <Index each={getCells()}>
                {(getDigit, index) => (
                    <div
                        class={styles.pinCell}
                        classList={{
                            [styles.isNext]: access(props.flags).isFocused && index === access(props.value).length,
                            [fieldStyles.isHovered]: access(props.flags).isHovered,
                            [fieldStyles.isDisabled]: access(props.flags).isDisabled,
                            [fieldStyles.hasError]: access(props.flags).hasError,
                        }}
                    >
                        {getDigit() ?? ""}
                    </div>
                )}
            </Index>
        </div>
    );
};
