import { For, type ParentProps, Show, createSignal } from "solid-js";

import {
    Accordion,
    Button,
    Checkbox,
    Listbox,
    MediaQueryMonitorSolidUtils,
    Progress,
    Radio,
    RadioGroup,
    Range,
    SHAPE_REVEAL_DEFAULTS,
    SlideButton,
    Tabs,
    TagInput,
    TextInput,
    Toggle,
} from "@thewaver/ss-components-solid";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    NO_MOTION_DURATION_MS,
    SKIN_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import { RADIO_GROUP_GAP } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import {
    SKIN_ROW_GAP,
    SKIN_SAMPLE_EXPANDED_SECTIONS,
    SKIN_SAMPLE_HOVERED_FLAGS,
    SKIN_SAMPLE_HOVERED_OPTION,
    SKIN_SAMPLE_OPTIONS,
    SKIN_SAMPLE_PROGRESS,
    SKIN_SAMPLE_RANGE,
    SKIN_SAMPLE_SECTIONS,
    SKIN_SAMPLE_SECTION_BODY,
    SKIN_SAMPLE_SELECTED_OPTION,
    SKIN_SAMPLE_SELECTED_TAB,
    SKIN_SAMPLE_SLIDE_DESCRIPTION,
    SKIN_SAMPLE_TABS,
    SKIN_SAMPLE_TAB_PANEL,
    SKIN_SAMPLE_TAGS,
    computeSkinRowId,
} from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";
import { ROW_TAB_GAP, getPanelId, getTabId } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as tabsPageStyles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import person from "@thewaver/ss-playground/App/person.svg";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { getAppliedSkin, revealSkin } from "../../PageComponents/Skin/SkinSolid.const";
import { PageTabPanel } from "../../PageComponents/TabPanel/TabPanel";
import {
    PageAccordionHeader,
    PageAccordionPanel,
    PageAccordionWrapper,
} from "../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageCheckboxContent } from "../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageControlButtonContent } from "../../StyledComponents/ControlButtonContent/ControlButtonContent";
import {
    PageGlideFloater,
    renderPageHighlightFloater,
    renderPageSelectionFloater,
} from "../../StyledComponents/GlideFloater/GlideFloater";
import { PageIcon } from "../../StyledComponents/Icon/Icon";
import { PageListboxSurface } from "../../StyledComponents/ListboxSurface/ListboxSurface";
import { PageProgressContent } from "../../StyledComponents/ProgressContent/ProgressContent";
import { PageRadioContent } from "../../StyledComponents/RadioContent/RadioContent";
import { PageRangeContent } from "../../StyledComponents/RangeContent/RangeContent";
import { PageSelectOptionContent } from "../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PageSlideButtonContent } from "../../StyledComponents/SlideButtonContent/SlideButtonContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../StyledComponents/TabContent/TabContent";
import {
    PageTagContent,
    PageTagInputContent,
    PageTagInputPlaceholder,
} from "../../StyledComponents/TagInputContent/TagInputContent";
import { PageTextFieldAdornment } from "../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import { PageTextFieldButtonContent } from "../../StyledComponents/TextFieldButtonContent/TextFieldButtonContent";
import { PageTextFieldContent } from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageToggleContent } from "../../StyledComponents/ToggleContent/ToggleContent";
import type {
    SkinHoveredOptionProps,
    SkinRowProps,
    SkinSampleColumnProps,
    SkinSamplesProps,
    SkinStateProps,
    SkinTabsSampleProps,
} from "./SkinsPage.types";

const SkinSampleColumn = (props: ParentProps<SkinSampleColumnProps>) => (
    <div class={styles.skinColumn}>
        <PageLayer level={1}>
            <div class={styles.skinColumnName}>{props.name}</div>

            {props.children}
        </PageLayer>
    </div>
);

const SkinStateGrid = (props: ParentProps) => <div class={styles.skinStateGrid}>{props.children}</div>;

const SkinStack = (props: ParentProps) => <div class={styles.skinBarStack}>{props.children}</div>;

const SkinBarCell = (props: ParentProps<SkinStateProps>) => (
    <div class={styles.skinBarCell}>
        <div class={styles.skinBarCaption}>{props.state}</div>

        {props.children}
    </div>
);

const SkinButtonSample = (props: SkinStateProps) => (
    <Button
        sizing={"fill"}
        isPressed={props.isPressed}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>{props.state}</PageButtonContent>}
    />
);

const SkinSimpleButtonSample = (props: SkinStateProps) => (
    <Button
        isPressed={props.isPressed}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(getFlags) => (
            <PageControlButtonContent flags={getFlags}>{props.state}</PageControlButtonContent>
        )}
    />
);

const SkinInputSample = (props: SkinStateProps) => {
    const valueSignal = createSignal(props.state);

    return (
        <TextInput
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
            renderLeading={(getFlags) => (
                <PageTextFieldAdornment flags={getFlags}>
                    <PageIcon src={person} />
                </PageTextFieldAdornment>
            )}
            renderTrailing={() => (
                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(getFlags) => (
                        <PageTextFieldButtonContent flags={getFlags}>Clear</PageTextFieldButtonContent>
                    )}
                />
            )}
        />
    );
};

const SkinToggleSample = (props: SkinStateProps) => {
    const checkedSignal = createSignal(props.isChecked ?? false);

    return (
        <Toggle
            checked={checkedSignal}
            isMixed={props.isMixed}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags}>{props.state}</PageToggleContent>}
        />
    );
};

const SkinCheckboxSample = (props: SkinStateProps) => {
    const checkedSignal = createSignal(props.isChecked ?? false);

    return (
        <Checkbox
            checked={checkedSignal}
            isMixed={props.isMixed}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags}>{props.state}</PageCheckboxContent>}
        />
    );
};

const SkinRadioSample = (props: SkinStateProps) => {
    const valueSignal = createSignal(props.isChecked ? props.state : undefined);

    return (
        <RadioGroup value={valueSignal} ariaLabel={props.state} gap={RADIO_GROUP_GAP} hasError={props.hasError}>
            <Radio
                value={() => props.state}
                ariaLabel={() => props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                renderContent={(getFlags) => <PageRadioContent flags={getFlags}>{props.state}</PageRadioContent>}
            />
        </RadioGroup>
    );
};

const SkinProgressSample = (props: SkinStateProps) => (
    <SkinBarCell state={props.state}>
        <Progress
            value={SKIN_SAMPLE_PROGRESS}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(getState) => <PageProgressContent state={getState} />}
        />
    </SkinBarCell>
);

const SkinRangeSample = (props: SkinStateProps) => {
    const valueSignal = createSignal(SKIN_SAMPLE_RANGE);

    return (
        <SkinBarCell state={props.state}>
            <Range
                value={valueSignal}
                ariaLabel={props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
            />
        </SkinBarCell>
    );
};

const SkinTagSample = (props: SkinStateProps) => {
    const valueSignal = createSignal(SKIN_SAMPLE_TAGS);

    return (
        <TagInput
            value={valueSignal}
            ariaLabel={props.state}
            gap={FIELD_GAP}
            padding={FIELD_PADDING}
            minHeight={FIELD_HEIGHT}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            computeTagAriaLabel={computeTagAriaLabel}
            renderContent={(getFlags) => <PageTagInputContent flags={getFlags} />}
            renderPlaceholder={() => <PageTagInputPlaceholder>{props.state}</PageTagInputPlaceholder>}
            renderTag={(getTag, getFlags) => <PageTagContent flags={getFlags}>{getTag()}</PageTagContent>}
        />
    );
};

const SkinHoveredOption = (props: SkinHoveredOptionProps) => (
    <div class={styles.skinHoveredOption}>
        <Show when={props.isGliding}>
            <div class={styles.skinHoveredFloater}>
                <PageGlideFloater kind={"highlight"} visibilityTarget={1} transitionDurationMs={0} />
            </div>
        </Show>

        <PageSelectOptionContent
            hasHoverFloater={props.isGliding}
            hasSelectionFloater={props.isGliding}
            flags={SKIN_SAMPLE_HOVERED_FLAGS}
        >
            {SKIN_SAMPLE_HOVERED_OPTION}
        </PageSelectOptionContent>
    </div>
);

const SkinListboxSample = () => {
    const valueSignal = createSignal<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);

    return (
        <PageListboxSurface>
            <Listbox
                value={valueSignal}
                options={SKIN_SAMPLE_OPTIONS}
                ariaLabel={"Listbox"}
                renderSelectionFloater={renderPageSelectionFloater}
                renderHighlightFloater={renderPageHighlightFloater}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent hasHoverFloater hasSelectionFloater flags={getFlags}>
                        {getOption().value}
                    </PageSelectOptionContent>
                )}
            />

            <SkinHoveredOption isGliding />
        </PageListboxSurface>
    );
};

const SkinListboxWithoutFloaterSample = () => {
    const valueSignal = createSignal<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);

    return (
        <PageListboxSurface>
            <Listbox
                value={valueSignal}
                options={SKIN_SAMPLE_OPTIONS}
                ariaLabel={"Listbox without floater"}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent flags={getFlags}>{getOption().value}</PageSelectOptionContent>
                )}
            />

            <SkinHoveredOption />
        </PageListboxSurface>
    );
};

const SkinSlideSample = (props: SkinStateProps) => (
    <SlideButton
        ariaDescription={SKIN_SAMPLE_SLIDE_DESCRIPTION}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(getRenderProps) => (
            <PageSlideButtonContent renderProps={getRenderProps}>{props.state}</PageSlideButtonContent>
        )}
    />
);

const SkinTabsSample = (props: SkinTabsSampleProps) => {
    const getIdPrefix = () => `skin-${props.skin}-${props.orientation}`;

    const getTabs = () =>
        SKIN_SAMPLE_TABS.map((tab) => ({
            ...tab,
            id: getTabId(getIdPrefix(), tab.value),
            panelId: getPanelId(getIdPrefix(), tab.value),
        }));

    return (
        <div class={tabsPageStyles.tabsDemo} data-orientation={props.orientation}>
            <Tabs
                orientation={props.orientation}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Tabs"}
                tabs={getTabs}
                selectedValue={() => SKIN_SAMPLE_SELECTED_TAB}
                renderGutter={() => <PageTabGutter orientation={props.orientation} />}
                renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabFloater
                        orientation={props.orientation}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderTab={(getTab, getFlags) => (
                    <PageTabContent
                        flags={getFlags}
                        orientation={props.orientation}
                        isSelected={() => getTab().value === SKIN_SAMPLE_SELECTED_TAB}
                    >
                        {getTab().value}
                    </PageTabContent>
                )}
            />

            <div class={tabsPageStyles.tabsDemoPanel}>
                <PageTabPanel
                    id={getPanelId(getIdPrefix(), SKIN_SAMPLE_SELECTED_TAB)}
                    tabId={getTabId(getIdPrefix(), SKIN_SAMPLE_SELECTED_TAB)}
                >
                    {SKIN_SAMPLE_TAB_PANEL}
                </PageTabPanel>
            </div>
        </div>
    );
};

const SkinSamples = (props: SkinSamplesProps) => {
    const expandedSignal = createSignal(SKIN_SAMPLE_EXPANDED_SECTIONS);

    return (
        <>
            <SkinSampleColumn name={"Surface"}>
                <div class={styles.skinPanel}>{"A panel inside a surface."}</div>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Tabs"}>
                <SkinTabsSample skin={props.skin} orientation={"horizontal"} />
            </SkinSampleColumn>

            <SkinSampleColumn name={"Vertical tabs"}>
                <SkinTabsSample skin={props.skin} orientation={"vertical"} />
            </SkinSampleColumn>

            <SkinSampleColumn name={"Input"}>
                <SkinStack>
                    <SkinInputSample state={"Default"} />
                    <SkinInputSample state={"Read-only"} isReadOnly />
                    <SkinInputSample state={"Disabled"} isDisabled />
                    <SkinInputSample state={"Error"} hasError />
                </SkinStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Tags"}>
                <SkinStack>
                    <SkinTagSample state={"Default"} />
                    <SkinTagSample state={"Disabled"} isDisabled />
                    <SkinTagSample state={"Error"} hasError />
                </SkinStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Listbox"}>
                <SkinStack>
                    <SkinBarCell state={"With floater"}>
                        <SkinListboxSample />
                    </SkinBarCell>

                    <SkinBarCell state={"Without floater"}>
                        <SkinListboxWithoutFloaterSample />
                    </SkinBarCell>
                </SkinStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Button"}>
                <SkinStateGrid>
                    <SkinButtonSample state={"Default"} />
                    <SkinButtonSample state={"Pressed"} isPressed />
                    <SkinButtonSample state={"Disabled"} isDisabled />
                    <SkinButtonSample state={"Error"} hasError />
                    <SkinButtonSample state={"Pressed Error"} isPressed hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Simple button"}>
                <SkinStateGrid>
                    <SkinSimpleButtonSample state={"Default"} />
                    <SkinSimpleButtonSample state={"Pressed"} isPressed />
                    <SkinSimpleButtonSample state={"Disabled"} isDisabled />
                    <SkinSimpleButtonSample state={"Error"} hasError />
                    <SkinSimpleButtonSample state={"Pressed Error"} isPressed hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Toggle"}>
                <SkinStateGrid>
                    <SkinToggleSample state={"Off"} />
                    <SkinToggleSample state={"On"} isChecked />
                    <SkinToggleSample state={"Mixed"} isMixed />
                    <SkinToggleSample state={"Disabled"} isDisabled />
                    <SkinToggleSample state={"Error"} hasError />
                    <SkinToggleSample state={"On Error"} isChecked hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Checkbox"}>
                <SkinStateGrid>
                    <SkinCheckboxSample state={"Off"} />
                    <SkinCheckboxSample state={"On"} isChecked />
                    <SkinCheckboxSample state={"Mixed"} isMixed />
                    <SkinCheckboxSample state={"Disabled"} isDisabled />
                    <SkinCheckboxSample state={"Error"} hasError />
                    <SkinCheckboxSample state={"On Error"} isChecked hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Radio"}>
                <SkinStateGrid>
                    <SkinRadioSample state={"Off"} />
                    <SkinRadioSample state={"On"} isChecked />
                    <SkinRadioSample state={"Disabled"} isDisabled />
                    <SkinRadioSample state={"Error"} hasError />
                    <SkinRadioSample state={"On Error"} isChecked hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Progress"}>
                <SkinStack>
                    <SkinProgressSample state={"Default"} />
                    <SkinProgressSample state={"Error"} hasError />
                </SkinStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Range"}>
                <SkinStack>
                    <SkinRangeSample state={"Default"} />
                    <SkinRangeSample state={"Disabled"} isDisabled />
                    <SkinRangeSample state={"Error"} hasError />
                </SkinStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Slide button"}>
                <SkinStack>
                    <SkinSlideSample state={"Default"} />
                    <SkinSlideSample state={"Disabled"} isDisabled />
                    <SkinSlideSample state={"Error"} hasError />
                </SkinStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Accordion"}>
                <div class={styles.skinWideSample}>
                    <Accordion
                        items={SKIN_SAMPLE_SECTIONS}
                        gap={DOCS_GAP}
                        expanded={expandedSignal}
                        renderSection={(renderContent, _, getFlags) => (
                            <PageAccordionWrapper flags={getFlags}>{renderContent()}</PageAccordionWrapper>
                        )}
                        renderHeader={(getItem, getFlags) => (
                            <PageAccordionHeader flags={getFlags}>{getItem().value}</PageAccordionHeader>
                        )}
                        renderPanel={(_getItem, getVisibilityTarget, getTransitionDurationMs) => (
                            <PageAccordionPanel
                                visibilityTarget={getVisibilityTarget}
                                transitionDurationMs={getTransitionDurationMs}
                            >
                                {SKIN_SAMPLE_SECTION_BODY}
                            </PageAccordionPanel>
                        )}
                    />
                </div>
            </SkinSampleColumn>
        </>
    );
};

const SkinRow = (props: SkinRowProps) => (
    <Radio
        value={() => props.skin}
        ariaLabel={() => props.label}
        sizing={"fill"}
        renderContent={(getFlags) => (
            <div id={computeSkinRowId(props.skin)} class={styles.skinRow}>
                <div class={styles.skinSampleBoundary}>
                    <div class={PLAYGROUND_SKINS[props.skin]}>
                        <div class={styles.skinSamples}>
                            <PageRadioContent flags={getFlags}>{props.label}</PageRadioContent>

                            <div class={styles.skinColumns} inert aria-hidden="true">
                                <SkinSamples skin={props.skin} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    />
);

export const SkinsPage = () => {
    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const pickSkin = (skin: PlaygroundSkin) => {
        void revealSkin(skin, {
            origin: document.getElementById(computeSkinRowId(skin)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    return (
        <div class={styles.skinsPage} data-view={"skins"}>
            <h1 class={styles.skinsTitle}>{"Skins"}</h1>

            <p class={styles.skinsDescription}>
                {
                    "A skin decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and where the theme's colors go. Each row shows the controls in one skin; picking a row applies it to every page."
                }
            </p>

            <RadioGroup
                value={[getAppliedSkin, pickSkin]}
                ariaLabel={"Skin"}
                orientation={"vertical"}
                gap={SKIN_ROW_GAP}
            >
                <For each={SKIN_OPTIONS}>{(option) => <SkinRow skin={option.value} label={option.label} />}</For>
            </RadioGroup>
        </div>
    );
};
