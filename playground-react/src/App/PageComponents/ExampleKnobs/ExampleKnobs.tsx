import type { PropsWithChildren } from "react";
import { useEffect, useId, useLayoutEffect, useState } from "react";

import type { AnchorPlacement, DismisserReason, PopupTriggerFlags } from "@thewaver/ss-components-react";
import { InteractionWrapper, Popover, PopupTrigger } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/PageComponents/ExampleKnobs/ExampleKnobs.css";

import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";
import { PageLayer } from "../Layer/Layer";
import { PagePropsPanel } from "../PropsPanel/PropsPanel";
import { useExampleKnobsContext } from "./ExampleKnobs.context";
import type { PageExampleKnobsButtonProps } from "./ExampleKnobs.types";

const KNOBS_PLACEMENT: AnchorPlacement = { x: "right-out", y: "top-in" };
const KNOBS_OFFSET = { x: 10, y: 0 };
const KNOBS_MARK = "⚙";
const TOOLTIP_PLACEMENT: AnchorPlacement = { x: "center", y: "top-out" };
const TOOLTIP_OFFSET = { x: 0, y: 10 };

export const PageExampleKnobsButton = (props: PageExampleKnobsButtonProps) => {
    const popupId = useId();

    const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const label = `${props.exampleName} settings`;

    const handleDismiss = (reason: DismisserReason) => {
        setIsOpen(false);

        if (reason === "escape") triggerRef?.querySelector("button")?.focus({ preventScroll: true });
    };

    return (
        <>
            <InteractionWrapper<PopupTriggerFlags>
                ref={setTriggerRef}
                extraFlags={{ isOpen }}
                tooltipDefs={{
                    placement: TOOLTIP_PLACEMENT,
                    offset: TOOLTIP_OFFSET,
                    renderContent: (visibilityTarget, transitionDurationMs) => (
                        <PageTooltipContent
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        >
                            Settings
                        </PageTooltipContent>
                    ),
                }}
                renderControl={(setElementRef, flags) => (
                    <PopupTrigger
                        ref={setElementRef}
                        id={`${props.exampleKey}Knobs`}
                        ariaLabel={label}
                        popupId={popupId}
                        isOpen={isOpen}
                        flags={flags}
                        renderContent={() => <span aria-hidden="true">{KNOBS_MARK}</span>}
                        onToggle={() => setIsOpen((wasOpen) => !wasOpen)}
                    />
                )}
            />

            <Popover
                id={popupId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": label }}
                isOpen={isOpen}
                anchorRef={triggerRef ?? undefined}
                placement={KNOBS_PLACEMENT}
                offset={KNOBS_OFFSET}
                hasAutoFocus={true}
                onDismiss={handleDismiss}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <div
                        className={[styles.exampleKnobsSurface, visibilityTarget === 1 && styles.isVisible]
                            .filter(Boolean)
                            .join(" ")}
                        style={{ transition: `opacity ${transitionDurationMs}ms` }}
                    >
                        <PageLayer level={2}>
                            <PagePropsPanel scope={"local"}>{props.renderKnobs()}</PagePropsPanel>
                        </PageLayer>
                    </div>
                )}
            />
        </>
    );
};

export const PageExampleKnobs = (props: PropsWithChildren) => {
    const exampleKnobs = useExampleKnobsContext();

    useLayoutEffect(() => {
        exampleKnobs?.setRenderKnobs(() => props.children);
    });

    useEffect(
        () => () => {
            exampleKnobs?.setRenderKnobs(undefined);
        },
        [exampleKnobs],
    );

    if (exampleKnobs) return null;

    return <PagePropsPanel scope={"local"}>{props.children}</PagePropsPanel>;
};
