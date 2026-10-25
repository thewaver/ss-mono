import type { JSX } from "solid-js";

import { ShortcutUtils } from "@thewaver/ss-components-solid";
import type {
    CommandPaletteAction,
    CommandPaletteActionGroup,
    CommandPaletteItem,
    CommandPaletteOptionRenderProps,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components-solid";
import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { PageListboxSurface } from "../../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageModalOverlay } from "../../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../../StyledComponents/ModalPanel/ModalPanel";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PageTextFieldContent } from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export * from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

export const renderPaletteOverlay = (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => (
    <PageModalOverlay visibilityTarget={getVisibilityTarget} transitionDurationMs={getTransitionDurationMs} />
);

export const renderPaletteField = (getFlags: () => InteractionFlags<TextFieldFlags>) => (
    <PageTextFieldContent flags={getFlags} />
);

export const renderPalettePlaceholder = (getFlags: () => InteractionFlags<TextFieldFlags>) => (
    <PageTextFieldPlaceholder flags={getFlags}>Search the actions</PageTextFieldPlaceholder>
);

export const renderPaletteOption = (
    getAction: () => CommandPaletteAction<string>,
    getRenderProps: () => CommandPaletteOptionRenderProps,
) => (
    <PageSelectOptionContent
        isGliding
        hasMark={false}
        flags={getRenderProps}
        shortcut={() => {
            const shortcut = getRenderProps().shortcut;

            return shortcut === undefined
                ? undefined
                : CommandPalettePageUtils.formatShortcut(shortcut, ShortcutUtils.getIsApplePlatform());
        }}
    >
        {getAction().value}
    </PageSelectOptionContent>
);

export const renderPaletteGroupHeader = (getGroup: () => CommandPaletteActionGroup<string>) => (
    <PageSelectGroupContent>{getGroup().label}</PageSelectGroupContent>
);

export const computePalettePanelRenderer =
    (getActions: () => CommandPaletteItem<string>[]) =>
    (
        renderField: () => JSX.Element,
        renderOptions: () => JSX.Element,
        getVisibilityTarget: () => 0 | 1,
        getTransitionDurationMs: () => number,
    ) => (
        <PageModalPanel visibilityTarget={getVisibilityTarget} transitionDurationMs={getTransitionDurationMs}>
            {renderField()}

            <PageListboxSurface>
                {getActions().length ? (
                    renderOptions()
                ) : (
                    <div class={popupStyles.popoverSurfaceEmpty}>No action matches that</div>
                )}
            </PageListboxSurface>
        </PageModalPanel>
    );
