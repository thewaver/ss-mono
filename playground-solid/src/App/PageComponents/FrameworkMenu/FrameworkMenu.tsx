import { useLocation } from "@solidjs/router";
import { Menu } from "@thewaver/ss-components-solid";
import type { MenuItem } from "@thewaver/ss-components-solid";
import {
    PLAYGROUND_FRAMEWORKS,
    PLAYGROUND_FRAMEWORK_LABELS,
    toFrameworkHref,
    toRoutePath,
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

export const PageFrameworkMenu = () => {
    const location = useLocation();

    return (
        <Menu
            items={() => FRAMEWORK_ITEMS}
            ariaLabel={"Framework"}
            checked={[() => [OWN_FRAMEWORK], () => {}]}
            renderContent={(getFlags) => (
                <PageFrameworkMenuTrigger flags={getFlags}>
                    {PLAYGROUND_FRAMEWORK_LABELS[OWN_FRAMEWORK]}
                </PageFrameworkMenuTrigger>
            )}
            renderItem={(getItem, getFlags) => (
                <PageFrameworkMenuItem flags={getFlags}>
                    {PLAYGROUND_FRAMEWORK_LABELS[getItem().value]}
                </PageFrameworkMenuItem>
            )}
            renderPopup={(renderItems, getVisibilityTarget, getTransitionDurationMs, getPlacement) => (
                <PageLayer level={2}>
                    <PagePopoverSurface
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        placement={getPlacement}
                    >
                        {renderItems()}
                    </PagePopoverSurface>
                </PageLayer>
            )}
            onActivate={(framework) => {
                if (framework === OWN_FRAMEWORK) return;

                window.location.assign(toFrameworkHref(framework, toRoutePath(location.pathname)));
            }}
        />
    );
};
