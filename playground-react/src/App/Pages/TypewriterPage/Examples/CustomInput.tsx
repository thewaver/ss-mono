import { useEffect, useRef } from "react";

import { Typewriter } from "@thewaver/ss-components-react";
import type { TypewriterController } from "@thewaver/ss-components-react";

import type { TypewriterExampleProps } from "../TypewriterPage.types";

type Props = TypewriterExampleProps & {
    text: string;
};

export const CustomInputExample = (props: Props) => {
    const hasMountedRef = useRef(false);
    const controllerRef = useRef<TypewriterController>(undefined);

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;

            return;
        }

        controllerRef.current?.update("content");
    }, [props.text]);

    return (
        <Typewriter
            animationName={props.animationName}
            computeCharacterWeights={props.computeCharacterWeights}
            onMount={(controller) => {
                controllerRef.current = controller;
            }}
        >
            {props.text}
        </Typewriter>
    );
};
