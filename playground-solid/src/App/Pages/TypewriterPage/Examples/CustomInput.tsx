import { createEffect, createSignal, on, onCleanup } from "solid-js";

import { Typewriter, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";
import { FunctionUtils } from "@thewaver/ss-utils";

import type { TypewriterExampleProps } from "../TypewriterPage.types";

type Props = TypewriterExampleProps &
    AccessorProps<{
        text: string;
    }>;

export const CustomInputExample = (props: Props) => {
    const [getText, setText] = createSignal(access(props.text));

    const setTextDebounced = FunctionUtils.debounce((text: string) => setText(text), 500);

    onCleanup(setTextDebounced.cancel);

    createEffect(on(() => access(props.text), setTextDebounced, { defer: true }));

    return (
        <Typewriter animationName={props.animationName} computeCharacterWeights={props.computeCharacterWeights}>
            {getText()}
        </Typewriter>
    );
};
