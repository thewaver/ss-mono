import { For } from "solid-js";

import {
    MediaQueryMonitorSolidUtils,
    Radio,
    RadioGroup,
    SHAPE_REVEAL_DEFAULTS,
    Toggle,
} from "@thewaver/ss-components-solid";
import {
    PAGE_VIEW_OPTIONS,
    THEME_FIELD_ID,
    THEME_OPTIONS,
    VIEWPORT_ANCHOR_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { NO_MOTION_DURATION_MS } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";

import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../StyledComponents/RadioSegmentContent/RadioSegmentContent";
import { PageToggleContent } from "../../StyledComponents/ToggleContent/ToggleContent";
import { PageExampleKnobsButton } from "../ExampleKnobs/ExampleKnobs";
import { PageSelectField } from "../Field/Field";
import { OWN_FRAMEWORK } from "../FrameworkMenu/FrameworkMenu.const";
import { PageProp } from "../Prop/Prop";
import { getAppliedTheme, revealTheme } from "../Theme/ThemeSolid.const";
import type {
    PageNavSettingsChoiceProps,
    PageNavSettingsProps,
    PlaygroundTheme,
    ViewportAnchor,
} from "./NavSettingsSolid.types";

const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
    VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

const computeThemeLabel = (theme: PlaygroundTheme) =>
    THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;

const PageNavSettingsChoice = <T,>(props: PageNavSettingsChoiceProps<T>) => (
    <PageRadioSegmentGroup>
        <RadioGroup
            value={props.value}
            ariaLabel={props.ariaLabel}
            orientation={"horizontal"}
            gap={0}
            renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                <PageRadioSegmentFloater
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                />
            )}
        >
            <For each={props.options}>
                {(option) => (
                    <Radio
                        value={() => option.value}
                        ariaLabel={() => option.label}
                        renderContent={(getFlags) => (
                            <PageRadioSegmentContent flags={getFlags}>{option.label}</PageRadioSegmentContent>
                        )}
                    />
                )}
            </For>
        </RadioGroup>
    </PageRadioSegmentGroup>
);

export const PageNavSettings = (props: PageNavSettingsProps) => {
    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const pickTheme = (theme: PlaygroundTheme) => {
        void revealTheme(theme, {
            origin: document.getElementById(THEME_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    return (
        <PageExampleKnobsButton
            exampleKey={"library"}
            exampleName={"Library"}
            renderKnobs={() => (
                <>
                    <PageProp
                        key={"showsDescriptionOnly"}
                        label={"Show pages without examples"}
                        hint={"Lists the pages that have docs but no examples yet, which are hidden otherwise."}
                        controls={EXAMPLES_ONLY_PROP}
                        defaultValue={false}
                    >
                        <Toggle
                            checked={props.showsDescriptionOnly}
                            ariaLabel={"Show pages without examples"}
                            renderContent={(getFlags) => <PageToggleContent flags={getFlags} />}
                        />
                    </PageProp>

                    <PageProp
                        key={"pageView"}
                        label={"Open pages on"}
                        hint={
                            "Which tab a page opens on when it is picked from the list. A page with no examples always opens on its docs."
                        }
                        controls={EXAMPLES_ONLY_PROP}
                        defaultValue={"Examples"}
                    >
                        <PageNavSettingsChoice
                            ariaLabel={"Open pages on"}
                            options={PAGE_VIEW_OPTIONS}
                            value={props.pageView}
                        />
                    </PageProp>

                    <PageProp
                        key={"viewportAnchor"}
                        label={"Viewport anchor"}
                        hint={
                            "The height the whole playground is laid out at before it is scaled to fit the window. None lays it out at the window's own size and Auto at the screen's height, both at the window's shape; 1080p and 1440p lay out a fixed 16:9 page of that height, with empty bars around it."
                        }
                        controls={EXAMPLES_ONLY_PROP}
                        defaultValue={"Auto"}
                    >
                        <PageSelectField
                            value={props.viewportAnchor[0]}
                            values={VIEWPORT_ANCHOR_OPTIONS.map((option) => option.value)}
                            computeLabel={computeViewportAnchorLabel}
                            ariaLabel={"Viewport anchor"}
                            onChange={props.viewportAnchor[1]}
                        />
                    </PageProp>

                    <PageProp
                        key={"theme"}
                        label={"Theme"}
                        hint={
                            "Which color theme the playground is drawn in, independent of the framework it runs in. The new theme is uncovered by a circle growing from this field."
                        }
                        controls={EXAMPLES_ONLY_PROP}
                        defaultValue={computeThemeLabel(OWN_FRAMEWORK)}
                    >
                        <PageSelectField
                            id={THEME_FIELD_ID}
                            value={getAppliedTheme}
                            values={THEME_OPTIONS.map((option) => option.value)}
                            computeLabel={computeThemeLabel}
                            ariaLabel={"Theme"}
                            onChange={pickTheme}
                        />
                    </PageProp>
                </>
            )}
        />
    );
};
