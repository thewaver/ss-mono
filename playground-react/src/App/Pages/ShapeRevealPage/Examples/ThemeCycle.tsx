import { useEffect, useRef, useState } from "react";

import { Button, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import {
    NO_MOTION_DURATION_MS,
    THEME_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

import { getAppliedTheme, revealTheme } from "../../../PageComponents/Theme/ThemeReact.const";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ShapeRevealExampleProps } from "../ShapeRevealExample.types";

type Props = ShapeRevealExampleProps;

const pickOtherTheme = (current: PlaygroundTheme) => {
    const others = THEME_OPTIONS.filter((option) => option.value !== current);

    return others[Math.floor(Math.random() * others.length)].value;
};

export const ThemeCycleExample = (props: Props) => {
    const [isCycling, setIsCycling] = useState(false);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const propsRef = useRef(props);
    const prefersReducedMotionRef = useRef(prefersReducedMotion);
    const buttonRef = useRef<HTMLElement | null>(null);
    const delayTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const runIdRef = useRef(0);

    propsRef.current = props;
    prefersReducedMotionRef.current = prefersReducedMotion;

    const cycle = async (id: number) => {
        await revealTheme(pickOtherTheme(getAppliedTheme()), {
            origin: buttonRef.current ?? undefined,
            durationMs: prefersReducedMotionRef.current ? NO_MOTION_DURATION_MS : propsRef.current.durationMs,
            computePoints: propsRef.current.computePoints,
            softness: propsRef.current.softness,
            startDegrees: propsRef.current.startDegrees,
            endDegrees: propsRef.current.endDegrees,
        });

        if (id !== runIdRef.current) return;

        delayTimerRef.current = setTimeout(() => void cycle(id), propsRef.current.delayMs);
    };

    const stop = () => {
        runIdRef.current += 1;
        clearTimeout(delayTimerRef.current);
        setIsCycling(false);
    };

    const toggle = () => {
        if (isCycling) return stop();

        setIsCycling(true);
        void cycle(runIdRef.current);
    };

    useEffect(
        () => () => {
            runIdRef.current += 1;
            clearTimeout(delayTimerRef.current);
        },
        [],
    );

    return (
        <Button
            ref={(element) => {
                buttonRef.current = element;
            }}
            renderContent={(flags) => (
                <PageButtonContent flags={flags}>{isCycling ? "Stop cycling" : "Start cycling"}</PageButtonContent>
            )}
            onClick={toggle}
        />
    );
};
