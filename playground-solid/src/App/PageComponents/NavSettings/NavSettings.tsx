import { MediaQueryMonitorSolidUtils, SHAPE_REVEAL_DEFAULTS, Toggle } from "@thewaver/ss-components-solid";
import {
    SKIN_FIELD_ID,
    SKIN_OPTIONS,
    THEME_FIELD_ID,
    THEME_OPTIONS,
    VIEWPORT_ANCHOR_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import {
    DEFAULT_THEME,
    NO_MOTION_DURATION_MS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import { DEFAULT_SKIN } from "@thewaver/ss-playground/App/Skins/Skin.const";

import { PageToggleContent } from "../../StyledComponents/ToggleContent/ToggleContent";
import { PageExampleKnobsButton } from "../ExampleKnobs/ExampleKnobs";
import { PageSelectField } from "../Field/Field";
import { PageProp } from "../Prop/Prop";
import { getAppliedSkin, revealSkin } from "../Skin/SkinSolid.const";
import { getAppliedTheme, revealTheme } from "../Theme/ThemeSolid.const";
import type { PageNavSettingsProps, PlaygroundSkin, PlaygroundTheme, ViewportAnchor } from "./NavSettingsSolid.types";

const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
    VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

const computeThemeLabel = (theme: PlaygroundTheme) =>
    THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;

const computeSkinLabel = (skin: PlaygroundSkin) => SKIN_OPTIONS.find((option) => option.value === skin)?.label ?? skin;

export const PageNavSettings = (props: PageNavSettingsProps) => {
    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const pickTheme = (theme: PlaygroundTheme) => {
        void revealTheme(theme, {
            origin: document.getElementById(THEME_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    const pickSkin = (skin: PlaygroundSkin) => {
        void revealSkin(skin, {
            origin: document.getElementById(SKIN_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
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
                        hint={
                            "Lists the pages with no live examples anywhere, only a description and the API, which are hidden otherwise."
                        }
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
                        defaultValue={computeThemeLabel(DEFAULT_THEME)}
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

                    <PageProp
                        key={"skin"}
                        label={"Skin"}
                        hint={
                            "How the playground is drawn: the shapes, borders, shadows and fonts its controls are painted with, and where the theme's colors go. The new skin is uncovered by a circle growing from this field."
                        }
                        controls={EXAMPLES_ONLY_PROP}
                        defaultValue={computeSkinLabel(DEFAULT_SKIN)}
                    >
                        <PageSelectField
                            id={SKIN_FIELD_ID}
                            value={getAppliedSkin}
                            values={SKIN_OPTIONS.map((option) => option.value)}
                            computeLabel={computeSkinLabel}
                            ariaLabel={"Skin"}
                            onChange={pickSkin}
                        />
                    </PageProp>
                </>
            )}
        />
    );
};
