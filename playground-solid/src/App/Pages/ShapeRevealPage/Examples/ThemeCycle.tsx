import { createSignal, onCleanup } from "solid-js";

import { Button, MediaQueryMonitorSolidUtils } from "@thewaver/ss-components-solid";
import {
    NO_MOTION_DURATION_MS,
    THEME_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import type { ShapeRevealExampleProps } from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";

import { getAppliedTheme, revealTheme } from "../../../PageComponents/Theme/ThemeSolid.const";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

type Props = ShapeRevealExampleProps;

const pickOtherTheme = (current: PlaygroundTheme) => {
    const others = THEME_OPTIONS.filter((option) => option.value !== current);

    return others[Math.floor(Math.random() * others.length)].value;
};

export const ThemeCycleExample = (props: Props) => {
    const [getIsCycling, setIsCycling] = createSignal(false);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    let buttonRef: HTMLElement | undefined;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    let runId = 0;

    const cycle = async (id: number) => {
        await revealTheme(pickOtherTheme(getAppliedTheme()), {
            origin: buttonRef,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : props.durationMs(),
            computePoints: props.computePoints(),
            softness: props.softness(),
            startDegrees: props.startDegrees(),
            endDegrees: props.endDegrees(),
        });

        if (id !== runId) return;

        delayTimer = setTimeout(() => void cycle(id), props.delayMs());
    };

    const stop = () => {
        runId += 1;
        clearTimeout(delayTimer);
        setIsCycling(false);
    };

    const toggle = () => {
        if (getIsCycling()) return stop();

        setIsCycling(true);
        void cycle(runId);
    };

    onCleanup(stop);

    return (
        <Button
            ref={(element) => (buttonRef = element)}
            renderContent={(getFlags) => (
                <PageButtonContent flags={getFlags}>
                    {getIsCycling() ? "Stop cycling" : "Start cycling"}
                </PageButtonContent>
            )}
            onClick={toggle}
        />
    );
};
