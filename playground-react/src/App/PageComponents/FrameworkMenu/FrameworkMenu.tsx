import { useLocation } from "react-router";

import { Menu } from "@thewaver/ss-components-react";
import type { MenuItem } from "@thewaver/ss-components-react";
import {
    PLAYGROUND_FRAMEWORKS,
    PLAYGROUND_FRAMEWORK_LABELS,
    toFrameworkHref,
} from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import type { PlaygroundFramework } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/PlaygroundFramework.types";

import {
    PageFrameworkMenuItem,
    PageFrameworkMenuTrigger,
} from "../../StyledComponents/FrameworkMenuContent/FrameworkMenuContent";
import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageLayer } from "../Layer/Layer";
import { OWN_FRAMEWORK } from "./FrameworkMenu.const";

const FRAMEWORK_ITEMS: MenuItem<PlaygroundFramework>[] = PLAYGROUND_FRAMEWORKS.map((framework) => ({
    value: framework,
    kind: "radio",
}));

const CHECKED_STATE: readonly [PlaygroundFramework[], () => void] = [[OWN_FRAMEWORK], () => {}];

export const PageFrameworkMenu = () => {
    const location = useLocation();

    return (
        <Menu
            items={FRAMEWORK_ITEMS}
            ariaLabel={"Framework"}
            checked={CHECKED_STATE}
            renderContent={(flags) => (
                <PageFrameworkMenuTrigger flags={flags}>
                    {PLAYGROUND_FRAMEWORK_LABELS[OWN_FRAMEWORK]}
                </PageFrameworkMenuTrigger>
            )}
            renderItem={(item, flags) => (
                <PageFrameworkMenuItem flags={flags}>{PLAYGROUND_FRAMEWORK_LABELS[item.value]}</PageFrameworkMenuItem>
            )}
            renderPopup={(renderItems, visibilityTarget, transitionDurationMs, placement) => (
                <PageLayer level={2}>
                    <PagePopoverSurface
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        placement={placement}
                    >
                        {renderItems()}
                    </PagePopoverSurface>
                </PageLayer>
            )}
            onActivate={(framework) => {
                if (framework === OWN_FRAMEWORK) return;

                window.location.assign(toFrameworkHref(framework, location.pathname));
            }}
        />
    );
};
