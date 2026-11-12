import { Fragment, type PropsWithChildren, useState } from "react";

import {
    Accordion,
    Button,
    Checkbox,
    Listbox,
    MediaQueryMonitorReactUtils,
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
} from "@thewaver/ss-components-react";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    NO_MOTION_DURATION_MS,
    SKIN_OPTIONS,
    THEME_OPTIONS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type {
    PlaygroundSkin,
    PlaygroundTheme,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
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
    THEME_SWATCH_FAMILIES,
    THEME_SWATCH_SHADES,
    computeSkinRowId,
    computeThemeRowId,
} from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";
import { RADIO_GROUP_GAP } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import { ROW_TAB_GAP, getPanelId, getTabId } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";
import person from "@thewaver/ss-playground/App/person.svg";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { revealSkin, useAppliedSkin } from "../../PageComponents/Skin/SkinReact.const";
import { PageTabPanel } from "../../PageComponents/TabPanel/TabPanel";
import { revealTheme, useAppliedTheme } from "../../PageComponents/Theme/ThemeReact.const";
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
import { useNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
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
    SkinStateGridProps,
    SkinStateProps,
    ThemeRowProps,
} from "./AppearancePage.types";

const SkinSampleColumn = (props: PropsWithChildren<SkinSampleColumnProps>) => {
    const nextLayerClass = useNextLayerClass();

    return (
        <div
            className={[styles.skinColumn, nextLayerClass, props.isWide && styles.skinWideColumn]
                .filter(Boolean)
                .join(" ")}
        >
            <PageLayer>
                <div className={styles.skinColumnName}>{props.name}</div>

                {props.children}
            </PageLayer>
        </div>
    );
};

const SkinStateGrid = (props: PropsWithChildren<SkinStateGridProps>) => (
    <div className={[styles.skinStateGrid, props.isFitted && styles.skinFittedStateGrid].filter(Boolean).join(" ")}>
        {props.children}
    </div>
);

const SkinBarStack = (props: PropsWithChildren) => <div className={styles.skinBarStack}>{props.children}</div>;

const SkinBarCell = (props: PropsWithChildren<SkinStateProps>) => (
    <div className={styles.skinBarCell}>
        <div className={styles.skinBarCaption}>{props.state}</div>

        {props.children}
    </div>
);

const SkinButtonSample = (props: SkinStateProps) => (
    <Button
        sizing={"fill"}
        isPressed={props.isPressed}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(flags) => <PageButtonContent flags={flags}>{props.state}</PageButtonContent>}
    />
);

const SkinSimpleButtonSample = (props: SkinStateProps) => (
    <Button
        isPressed={props.isPressed}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(flags) => <PageControlButtonContent flags={flags}>{props.state}</PageControlButtonContent>}
    />
);

const SkinInputSample = (props: SkinStateProps) => {
    const valueState = useState(props.state);

    return (
        <TextInput
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            renderLeading={(flags) => (
                <PageTextFieldAdornment flags={flags}>
                    <PageIcon src={person} />
                </PageTextFieldAdornment>
            )}
            renderTrailing={() => (
                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => (
                        <PageTextFieldButtonContent flags={flags}>Clear</PageTextFieldButtonContent>
                    )}
                />
            )}
        />
    );
};

const SkinToggleSample = (props: SkinStateProps) => {
    const checkedState = useState(props.isChecked ?? false);

    return (
        <Toggle
            checked={checkedState}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(flags) => <PageToggleContent flags={flags}>{props.state}</PageToggleContent>}
        />
    );
};

const SkinCheckboxSample = (props: SkinStateProps) => {
    const checkedState = useState(props.isChecked ?? false);

    return (
        <Checkbox
            checked={checkedState}
            isMixed={props.isMixed}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(flags) => <PageCheckboxContent flags={flags}>{props.state}</PageCheckboxContent>}
        />
    );
};

const SkinRadioSample = (props: SkinStateProps) => {
    const valueState = useState(props.isChecked ? props.state : undefined);

    return (
        <RadioGroup value={valueState} ariaLabel={props.state} gap={RADIO_GROUP_GAP} hasError={props.hasError}>
            <Radio
                value={props.state}
                ariaLabel={props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                renderContent={(flags) => <PageRadioContent flags={flags}>{props.state}</PageRadioContent>}
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
            renderContent={(state) => <PageProgressContent state={state} />}
        />
    </SkinBarCell>
);

const SkinRangeSample = (props: SkinStateProps) => {
    const valueState = useState(SKIN_SAMPLE_RANGE);

    return (
        <SkinBarCell state={props.state}>
            <Range
                value={valueState}
                ariaLabel={props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
            />
        </SkinBarCell>
    );
};

const SkinTagSample = (props: SkinStateProps) => {
    const valueState = useState(SKIN_SAMPLE_TAGS);

    return (
        <TagInput
            value={valueState}
            ariaLabel={props.state}
            gap={FIELD_GAP}
            padding={FIELD_PADDING}
            minHeight={FIELD_HEIGHT}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            computeTagAriaLabel={computeTagAriaLabel}
            renderContent={(flags) => <PageTagInputContent flags={flags} />}
            renderPlaceholder={() => <PageTagInputPlaceholder>{props.state}</PageTagInputPlaceholder>}
            renderTag={(tag, flags) => <PageTagContent flags={flags}>{tag}</PageTagContent>}
        />
    );
};

const SkinHoveredOption = (props: SkinHoveredOptionProps) => (
    <div className={styles.skinHoveredOption}>
        {props.isGliding ? (
            <div className={styles.skinHoveredFloater}>
                <PageGlideFloater kind={"highlight"} visibilityTarget={1} transitionDurationMs={0} />
            </div>
        ) : null}

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
    const valueState = useState<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);

    return (
        <PageListboxSurface>
            <Listbox
                value={valueState}
                options={SKIN_SAMPLE_OPTIONS}
                ariaLabel={"Listbox"}
                renderSelectionFloater={renderPageSelectionFloater}
                renderHighlightFloater={renderPageHighlightFloater}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent hasHoverFloater hasSelectionFloater flags={flags}>
                        {option.value}
                    </PageSelectOptionContent>
                )}
            />

            <SkinHoveredOption isGliding />
        </PageListboxSurface>
    );
};

const SkinListboxWithoutFloaterSample = () => {
    const valueState = useState<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);

    return (
        <PageListboxSurface>
            <Listbox
                value={valueState}
                options={SKIN_SAMPLE_OPTIONS}
                ariaLabel={"Listbox without floater"}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
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
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>{props.state}</PageSlideButtonContent>
        )}
    />
);

const SkinSamples = (props: SkinSamplesProps) => {
    const expandedState = useState(SKIN_SAMPLE_EXPANDED_SECTIONS);

    const idPrefix = `skin-${props.skin}`;

    const tabs = SKIN_SAMPLE_TABS.map((tab) => ({
        ...tab,
        id: getTabId(idPrefix, tab.value),
        panelId: getPanelId(idPrefix, tab.value),
    }));

    return (
        <>
            <SkinSampleColumn name={"Surface"}>
                <div className={styles.skinPanel}>{"A panel inside a surface."}</div>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Tabs"}>
                <div className={styles.skinWideSample}>
                    <Tabs
                        tabGap={ROW_TAB_GAP}
                        ariaLabel={"Tabs"}
                        tabs={tabs}
                        selectedValue={SKIN_SAMPLE_SELECTED_TAB}
                        renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                        renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                            <PageTabFloater
                                orientation={"horizontal"}
                                visibilityTarget={visibilityTarget}
                                transitionDurationMs={transitionDurationMs}
                            />
                        )}
                        renderTab={(tab, flags) => (
                            <PageTabContent
                                flags={flags}
                                orientation={"horizontal"}
                                isSelected={tab.value === SKIN_SAMPLE_SELECTED_TAB}
                            >
                                {tab.value}
                            </PageTabContent>
                        )}
                    />

                    <PageTabPanel
                        id={getPanelId(idPrefix, SKIN_SAMPLE_SELECTED_TAB)}
                        tabId={getTabId(idPrefix, SKIN_SAMPLE_SELECTED_TAB)}
                    >
                        {SKIN_SAMPLE_TAB_PANEL}
                    </PageTabPanel>
                </div>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Input"} isWide>
                <SkinStateGrid isFitted>
                    <SkinInputSample state={"Default"} />
                    <SkinInputSample state={"Read-only"} isReadOnly />
                    <SkinInputSample state={"Disabled"} isDisabled />
                    <SkinInputSample state={"Error"} hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Tags"} isWide>
                <SkinStateGrid isFitted>
                    <SkinTagSample state={"Default"} />
                    <SkinTagSample state={"Disabled"} isDisabled />
                    <SkinTagSample state={"Error"} hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Listbox"}>
                <SkinBarStack>
                    <SkinBarCell state={"With floater"}>
                        <SkinListboxSample />
                    </SkinBarCell>

                    <SkinBarCell state={"Without floater"}>
                        <SkinListboxWithoutFloaterSample />
                    </SkinBarCell>
                </SkinBarStack>
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
                    <SkinToggleSample state={"Disabled"} isDisabled />
                    <SkinToggleSample state={"Error"} hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Checkbox"}>
                <SkinStateGrid>
                    <SkinCheckboxSample state={"Off"} />
                    <SkinCheckboxSample state={"On"} isChecked />
                    <SkinCheckboxSample state={"Mixed"} isMixed />
                    <SkinCheckboxSample state={"Disabled"} isDisabled />
                    <SkinCheckboxSample state={"Error"} hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Radio"}>
                <SkinStateGrid>
                    <SkinRadioSample state={"Off"} />
                    <SkinRadioSample state={"On"} isChecked />
                    <SkinRadioSample state={"Disabled"} isDisabled />
                    <SkinRadioSample state={"Error"} hasError />
                </SkinStateGrid>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Progress"}>
                <SkinBarStack>
                    <SkinProgressSample state={"Default"} />
                    <SkinProgressSample state={"Error"} hasError />
                </SkinBarStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Range"}>
                <SkinBarStack>
                    <SkinRangeSample state={"Default"} />
                    <SkinRangeSample state={"Disabled"} isDisabled />
                    <SkinRangeSample state={"Error"} hasError />
                </SkinBarStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Slide button"}>
                <SkinBarStack>
                    <SkinSlideSample state={"Default"} />
                    <SkinSlideSample state={"Disabled"} isDisabled />
                    <SkinSlideSample state={"Error"} hasError />
                </SkinBarStack>
            </SkinSampleColumn>

            <SkinSampleColumn name={"Accordion"}>
                <div className={styles.skinWideSample}>
                    <Accordion
                        items={SKIN_SAMPLE_SECTIONS}
                        gap={DOCS_GAP}
                        expanded={expandedState}
                        renderSection={(renderContent, _, flags) => (
                            <PageAccordionWrapper flags={flags}>{renderContent()}</PageAccordionWrapper>
                        )}
                        renderHeader={(item, flags) => (
                            <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>
                        )}
                        renderPanel={(_item, visibilityTarget, transitionDurationMs) => (
                            <PageAccordionPanel
                                visibilityTarget={visibilityTarget}
                                transitionDurationMs={transitionDurationMs}
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
        value={props.skin}
        ariaLabel={props.label}
        sizing={"fill"}
        renderContent={(flags) => (
            <div id={computeSkinRowId(props.skin)} className={styles.skinRow}>
                <div className={styles.skinSampleBoundary}>
                    <div className={PLAYGROUND_SKINS[props.skin]}>
                        <div className={styles.skinSamples}>
                            <PageRadioContent flags={flags}>{props.label}</PageRadioContent>

                            <div className={styles.skinColumns} inert={true} aria-hidden="true">
                                <SkinSamples skin={props.skin} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    />
);

const ThemeRow = (props: ThemeRowProps) => (
    <Radio
        value={props.theme}
        ariaLabel={props.label}
        sizing={"fill"}
        renderContent={(flags) => (
            <div id={computeThemeRowId(props.theme)} className={`${styles.skinRow} ${PLAYGROUND_THEMES[props.theme]}`}>
                <div className={styles.skinSamples}>
                    <PageRadioContent flags={flags}>{props.label}</PageRadioContent>

                    <div className={styles.themeGrid} inert={true} aria-hidden="true">
                        <span />

                        {THEME_SWATCH_FAMILIES.map((family) => (
                            <span key={family} className={styles.skinColumnName}>
                                {family}
                            </span>
                        ))}

                        {THEME_SWATCH_SHADES.map((shade) => (
                            <Fragment key={shade}>
                                <span className={styles.skinColumnName}>{shade}</span>

                                {THEME_SWATCH_FAMILIES.map((family) => (
                                    <div key={family} className={styles.themeSwatches[family][shade]} />
                                ))}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        )}
    />
);

export const AppearancePage = () => {
    const theme = useAppliedTheme();
    const skin = useAppliedSkin();

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const pickTheme = (nextTheme: PlaygroundTheme) => {
        void revealTheme(nextTheme, {
            origin: document.getElementById(computeThemeRowId(nextTheme)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: prefersReducedMotion ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    const pickSkin = (nextSkin: PlaygroundSkin) => {
        void revealSkin(nextSkin, {
            origin: document.getElementById(computeSkinRowId(nextSkin)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: prefersReducedMotion ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    return (
        <div className={styles.appearancePage} data-view={"appearance"}>
            <h1 className={styles.appearanceTitle}>{"Appearance"}</h1>

            <section className={styles.appearanceSection}>
                <h2 className={styles.appearanceHeading}>{"Theme"}</h2>

                <p className={styles.appearanceDescription}>
                    {
                        "A theme decides the playground's colors. Each row shows one theme: a column per color, a line per shade; picking a row applies it to every page."
                    }
                </p>

                <RadioGroup value={[theme, pickTheme]} ariaLabel={"Theme"} orientation={"vertical"} gap={SKIN_ROW_GAP}>
                    {THEME_OPTIONS.map((option) => (
                        <ThemeRow key={option.value} theme={option.value} label={option.label} />
                    ))}
                </RadioGroup>
            </section>

            <section className={styles.appearanceSection}>
                <h2 className={styles.appearanceHeading}>{"Skin"}</h2>

                <p className={styles.appearanceDescription}>
                    {
                        "A skin decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and where the theme's colors go. Each row shows the controls in one skin; picking a row applies it to every page."
                    }
                </p>

                <RadioGroup value={[skin, pickSkin]} ariaLabel={"Skin"} orientation={"vertical"} gap={SKIN_ROW_GAP}>
                    {SKIN_OPTIONS.map((option) => (
                        <SkinRow key={option.value} skin={option.value} label={option.label} />
                    ))}
                </RadioGroup>
            </section>
        </div>
    );
};
