import type { ReactNode } from "react";

import { ShortcutUtils } from "@thewaver/ss-components-react";
import type {
    CommandPaletteAction,
    CommandPaletteActionGroup,
    CommandPaletteItem,
    CommandPaletteOptionRenderProps,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components-react";
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

export const renderPaletteOverlay = (visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
);

export const renderPaletteField = (flags: InteractionFlags<TextFieldFlags>) => <PageTextFieldContent flags={flags} />;

export const renderPalettePlaceholder = (flags: InteractionFlags<TextFieldFlags>) => (
    <PageTextFieldPlaceholder flags={flags}>Search the actions</PageTextFieldPlaceholder>
);

export const renderPaletteOption = (
    action: CommandPaletteAction<string>,
    renderProps: CommandPaletteOptionRenderProps,
) => (
    <PageSelectOptionContent
        isGliding
        hasMark={false}
        flags={renderProps}
        shortcut={
            renderProps.shortcut === undefined
                ? undefined
                : CommandPalettePageUtils.formatShortcut(renderProps.shortcut, ShortcutUtils.getIsApplePlatform())
        }
    >
        {action.value}
    </PageSelectOptionContent>
);

export const renderPaletteGroupHeader = (group: CommandPaletteActionGroup<string>) => (
    <PageSelectGroupContent>{group.label}</PageSelectGroupContent>
);

export const computePalettePanelRenderer =
    (actions: CommandPaletteItem<string>[]) =>
    (
        renderField: () => ReactNode,
        renderOptions: () => ReactNode,
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
    ) => (
        <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
            {renderField()}

            <PageListboxSurface>
                {actions.length ? (
                    renderOptions()
                ) : (
                    <div className={popupStyles.popoverSurfaceEmpty}>No action matches that</div>
                )}
            </PageListboxSurface>
        </PageModalPanel>
    );
