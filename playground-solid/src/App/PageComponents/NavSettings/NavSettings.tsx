import { For, createSignal } from "solid-js";

import {
    MediaQueryMonitorSolidUtils,
    Radio,
    RadioGroup,
    SHAPE_REVEAL_DEFAULTS,
    ShapeRevealUtils,
    Toggle,
} from "@thewaver/ss-components-solid";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

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
import { PAGE_VIEW_OPTIONS, THEME_FIELD_ID, THEME_OPTIONS, VIEWPORT_ANCHOR_OPTIONS } from "./NavSettings.const";
import type {
    PageNavSettingsChoiceProps,
    PageNavSettingsProps,
    PlaygroundTheme,
    ViewportAnchor,
} from "./NavSettings.types";

const NO_MOTION_DURATION_MS = 0;

const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
    VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

const computeThemeLabel = (theme: PlaygroundTheme) =>
    THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;

const findAppliedTheme = () =>
    THEME_OPTIONS.find((option) => document.documentElement.classList.contains(PLAYGROUND_THEMES[option.value]))
        ?.value ?? OWN_FRAMEWORK;

const applyTheme = (theme: PlaygroundTheme) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_THEMES));
    document.documentElement.classList.add(PLAYGROUND_THEMES[theme]);
};

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
    const [getTheme, setTheme] = createSignal(findAppliedTheme());

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const pickTheme = (theme: PlaygroundTheme) => {
        setTheme(theme);

        void ShapeRevealUtils.reveal(() => applyTheme(theme), {
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
                        defaultValue={computeThemeLabel(OWN_FRAMEWORK)}
                    >
                        <PageSelectField
                            id={THEME_FIELD_ID}
                            value={getTheme}
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
