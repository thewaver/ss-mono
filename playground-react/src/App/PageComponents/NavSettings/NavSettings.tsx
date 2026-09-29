import { useState } from "react";
import { useLocation } from "react-router";

import { Radio, RadioGroup, Toggle } from "@thewaver/ss-components-react";
import {
    PLAYGROUND_FRAMEWORKS,
    PLAYGROUND_FRAMEWORK_LABELS,
    toFrameworkHref,
} from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import type { PlaygroundFramework } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/PlaygroundFramework.types";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../StyledComponents/RadioSegmentContent/RadioSegmentContent";
import { PageToggleContent } from "../../StyledComponents/ToggleContent/ToggleContent";
import { PageExampleKnobsButton } from "../ExampleKnobs/ExampleKnobs";
import { PageSelectField } from "../Field/Field";
import { PageProp } from "../Prop/Prop";
import { PAGE_VIEW_OPTIONS, THEME_OPTIONS, VIEWPORT_ANCHOR_OPTIONS } from "./NavSettings.const";
import type {
    PageNavSettingsChoiceProps,
    PageNavSettingsProps,
    PlaygroundTheme,
    ViewportAnchor,
} from "./NavSettings.types";

const OWN_FRAMEWORK: PlaygroundFramework = "react";

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
            renderFloater={(visibilityTarget, transitionDurationMs) => (
                <PageRadioSegmentFloater
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                />
            )}
        >
            {props.options.map((option) => (
                <Radio
                    key={option.label}
                    value={option.value}
                    ariaLabel={option.label}
                    renderContent={(flags) => (
                        <PageRadioSegmentContent flags={flags}>{option.label}</PageRadioSegmentContent>
                    )}
                />
            ))}
        </RadioGroup>
    </PageRadioSegmentGroup>
);

export const PageNavSettings = (props: PageNavSettingsProps) => {
    const location = useLocation();
    const [theme, setTheme] = useState(findAppliedTheme);

    const pickTheme = (nextTheme: PlaygroundTheme) => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
    };

    return (
        <PageExampleKnobsButton
            exampleKey={"library"}
            exampleName={"Library"}
            renderKnobs={() => (
                <>
                    <PageProp
                        itemKey={"showsDescriptionOnly"}
                        label={"Show pages without examples"}
                        hint={"Lists the pages that have docs but no examples yet, which are hidden otherwise."}
                        defaultValue={false}
                    >
                        <Toggle
                            checked={props.showsDescriptionOnly}
                            ariaLabel={"Show pages without examples"}
                            renderContent={(flags) => <PageToggleContent flags={flags} />}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"pageView"}
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
                        itemKey={"viewportAnchor"}
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
                        itemKey={"theme"}
                        label={"Theme"}
                        hint={"Which color theme the playground is drawn in, independent of the framework it runs in."}
                        defaultValue={computeThemeLabel(OWN_FRAMEWORK)}
                    >
                        <PageSelectField
                            value={theme}
                            values={THEME_OPTIONS.map((option) => option.value)}
                            computeLabel={computeThemeLabel}
                            ariaLabel={"Theme"}
                            onChange={pickTheme}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"theme"}
                        label={"Theme"}
                        hint={"Which color theme the playground is drawn in, independent of the framework it runs in."}
                        defaultValue={computeThemeLabel(OWN_FRAMEWORK)}
                    >
                        <PageSelectField
                            value={theme}
                            values={THEME_OPTIONS.map((option) => option.value)}
                            computeLabel={computeThemeLabel}
                            ariaLabel={"Theme"}
                            onChange={pickTheme}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"framework"}
                        label={"Framework"}
                        hint={"Which framework the playground runs in. Picking another opens this same page there."}
                        defaultValue={PLAYGROUND_FRAMEWORK_LABELS[OWN_FRAMEWORK]}
                    >
                        <PageSelectField
                            value={OWN_FRAMEWORK}
                            values={PLAYGROUND_FRAMEWORKS}
                            computeLabel={(framework) => PLAYGROUND_FRAMEWORK_LABELS[framework]}
                            ariaLabel={"Framework"}
                            onChange={(framework) => {
                                if (framework === OWN_FRAMEWORK) return;

                                window.location.assign(toFrameworkHref(framework, location.pathname));
                            }}
                        />
                    </PageProp>
                </>
            )}
        />
    );
};
