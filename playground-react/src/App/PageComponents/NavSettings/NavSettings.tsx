import { useLocation } from "react-router";

import { Radio, RadioGroup, Toggle } from "@thewaver/ss-components-react";
import {
    PLAYGROUND_FRAMEWORKS,
    PLAYGROUND_FRAMEWORK_LABELS,
    toOtherFrameworkHref,
} from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import type { PlaygroundFramework } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/PlaygroundFramework.types";

import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../StyledComponents/RadioSegmentContent/RadioSegmentContent";
import { PageToggleContent } from "../../StyledComponents/ToggleContent/ToggleContent";
import { PageExampleKnobsButton } from "../ExampleKnobs/ExampleKnobs";
import { PageSelectField } from "../Field/Field";
import { PageProp } from "../Prop/Prop";
import { PAGE_VIEW_OPTIONS, VIEWPORT_ANCHOR_OPTIONS } from "./NavSettings.const";
import type { PageNavSettingsChoiceProps, PageNavSettingsProps, ViewportAnchor } from "./NavSettings.types";

const OWN_FRAMEWORK: PlaygroundFramework = "react";

const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
    VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

const PageNavSettingsChoice = <T,>(props: PageNavSettingsChoiceProps<T>) => (
    <PageRadioSegmentGroup>
        <RadioGroup
            valueState={props.valueState}
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
                            checkedState={props.showsDescriptionOnlyState}
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
                            valueState={props.pageViewState}
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
                            value={props.viewportAnchorState[0]}
                            values={VIEWPORT_ANCHOR_OPTIONS.map((option) => option.value)}
                            computeLabel={computeViewportAnchorLabel}
                            ariaLabel={"Viewport anchor"}
                            onChange={props.viewportAnchorState[1]}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"framework"}
                        label={"Framework"}
                        hint={"Which framework the playground runs in. Picking the other opens this same page there."}
                        defaultValue={PLAYGROUND_FRAMEWORK_LABELS[OWN_FRAMEWORK]}
                    >
                        <PageSelectField
                            value={OWN_FRAMEWORK}
                            values={PLAYGROUND_FRAMEWORKS}
                            computeLabel={(framework) => PLAYGROUND_FRAMEWORK_LABELS[framework]}
                            ariaLabel={"Framework"}
                            onChange={(framework) => {
                                if (framework === OWN_FRAMEWORK) return;

                                window.location.assign(toOtherFrameworkHref(location.pathname));
                            }}
                        />
                    </PageProp>
                </>
            )}
        />
    );
};
