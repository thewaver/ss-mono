import { useEffect, useRef, useState } from "react";

import { Typewriter } from "@thewaver/ss-components-react";
import type { TypewriterController } from "@thewaver/ss-components-react";
import { FunctionUtils } from "@thewaver/ss-utils";

import type { TypewriterExampleProps } from "../TypewriterPage.types";

type Props = TypewriterExampleProps & {
    text: string;
};

export const CustomInputExample = (props: Props) => {
    const hasMountedRef = useRef(false);
    const controllerRef = useRef<TypewriterController>(undefined);
    const [text, setText] = useState(props.text);
    const [setTextDebounced] = useState(() => FunctionUtils.debounce(setText, 500));

    useEffect(() => setTextDebounced.cancel, [setTextDebounced]);

    useEffect(() => setTextDebounced(props.text), [props.text, setTextDebounced]);

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;

            return;
        }

        controllerRef.current?.update("content");
    }, [text]);

    return (
        <Typewriter
            animationName={props.animationName}
            computeCharacterWeights={props.computeCharacterWeights}
            onMount={(controller) => {
                controllerRef.current = controller;
            }}
        >
            {text}
        </Typewriter>
    );
};
