import { For } from "solid-js";

import { Checkbox, Radio, RadioGroup } from "@thewaver/ss-components";

import { PageCheckboxContent } from "../../StyledComponents/CheckboxContent/CheckboxContent";
import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../StyledComponents/RadioSegmentContent/RadioSegmentContent";
import { PageExampleKnobsButton } from "../ExampleKnobs/ExampleKnobs";
import { PageProp } from "../Prop/Prop";
import { PAGE_VIEW_OPTIONS, VIEWPORT_ANCHOR_OPTIONS } from "./NavSettings.const";
import type { PageNavSettingsChoiceProps, PageNavSettingsProps } from "./NavSettings.types";

const PageNavSettingsChoice = <T,>(props: PageNavSettingsChoiceProps<T>) => (
    <PageRadioSegmentGroup>
        <RadioGroup
            valueSignal={props.valueSignal}
            ariaLabel={props.ariaLabel}
            orientation={"horizontal"}
            gap={0}
            renderFloater={(getVisibilityTarget, getTransitionDurationMs) => (
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

export const PageNavSettings = (props: PageNavSettingsProps) => (
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
                    <Checkbox
                        checkedSignal={props.showsDescriptionOnlySignal}
                        ariaLabel={"Show pages without examples"}
                        renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
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
                        valueSignal={props.pageViewSignal}
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
                    <PageNavSettingsChoice
                        ariaLabel={"Viewport anchor"}
                        options={VIEWPORT_ANCHOR_OPTIONS}
                        valueSignal={props.viewportAnchorSignal}
                    />
                </PageProp>
            </>
        )}
    />
);
