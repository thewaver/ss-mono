import type { ParentProps } from "solid-js";
import { Show, createSignal, createUniqueId, onCleanup } from "solid-js";

import type { AnchorPlacement, DismisserReason, PopupTriggerFlags } from "@thewaver/ss-components";
import { InteractionWrapper, Popover, PopupTrigger, access } from "@thewaver/ss-components";

import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";
import { PageLayer } from "../Layer/Layer";
import { PagePropsPanel } from "../PropsPanel/PropsPanel";
import { useExampleKnobsContext } from "./ExampleKnobs.context";
import type { PageExampleKnobsButtonProps } from "./ExampleKnobs.types";

import * as styles from "./ExampleKnobs.css";

const KNOBS_PLACEMENT: AnchorPlacement = { x: "right-out", y: "top-in" };
const KNOBS_OFFSET = { x: 10, y: 0 };
const KNOBS_MARK = "⚙";
const TOOLTIP_PLACEMENT: AnchorPlacement = { x: "center", y: "top-out" };
const TOOLTIP_OFFSET = { x: 0, y: 10 };

export const PageExampleKnobsButton = (props: PageExampleKnobsButtonProps) => {
    const popupId = createUniqueId();

    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = createSignal(false);

    const getLabel = () => `${access(props.exampleName)} settings`;

    const handleDismiss = (reason: DismisserReason) => {
        setIsOpen(false);

        if (reason === "escape") getTriggerRef()?.querySelector("button")?.focus({ preventScroll: true });
    };

    return (
        <>
            <InteractionWrapper<PopupTriggerFlags>
                ref={setTriggerRef}
                extraFlags={() => ({ isOpen: getIsOpen() })}
                tooltipDefs={() => ({
                    placement: () => TOOLTIP_PLACEMENT,
                    offset: () => TOOLTIP_OFFSET,
                    renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                        <PageTooltipContent
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                        >
                            Settings
                        </PageTooltipContent>
                    ),
                })}
                renderControl={(setElementRef, getFlags) => (
                    <PopupTrigger
                        ref={setElementRef}
                        id={() => `${access(props.exampleKey)}Knobs`}
                        ariaLabel={getLabel}
                        popupId={() => popupId}
                        isOpen={getIsOpen}
                        flags={getFlags}
                        renderContent={() => <span aria-hidden="true">{KNOBS_MARK}</span>}
                        onToggle={() => setIsOpen((isOpen) => !isOpen)}
                    />
                )}
            />

            <Popover
                id={() => popupId}
                role={"dialog"}
                ariaAttributes={() => ({ "aria-label": getLabel() })}
                isOpen={getIsOpen}
                anchorRef={getTriggerRef}
                placement={() => KNOBS_PLACEMENT}
                offset={() => KNOBS_OFFSET}
                hasAutoFocus={true}
                onDismiss={handleDismiss}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <div
                        class={styles.exampleKnobsSurface}
                        classList={{ [styles.isVisible]: getVisibilityTarget() === 1 }}
                        style={{ transition: `opacity ${getTransitionDurationMs()}ms` }}
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

export const PageExampleKnobs = (props: ParentProps) => {
    const exampleKnobs = useExampleKnobsContext();

    exampleKnobs?.setRenderKnobs(() => props.children);

    onCleanup(() => {
        exampleKnobs?.setRenderKnobs(undefined);
    });

    return (
        <Show when={!exampleKnobs}>
            <PagePropsPanel scope={"local"}>{props.children}</PagePropsPanel>
        </Show>
    );
};
