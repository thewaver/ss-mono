<script lang="ts">
    import { untrack } from "svelte";

    import { Accordion, Scroller, Tabs, getViewportContext } from "@thewaver/ss-components-svelte";
    import type { AccordionItem, Tab } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/SourceView/SourceView.css";
    import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

    import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.svelte";
    import PageCodeBox from "../CodeBox/CodeBox.svelte";
    import PageScrollerButton from "../ScrollerButton/ScrollerButton.svelte";
    import PageTabPanel from "../TabPanel/TabPanel.svelte";
    import type { SourceGroup, SourceViewProps } from "./SourceView.types";
    import { SourceViewUtils } from "./SourceView.utils";

    const TAB_GAP = 10;
    const SECTION_GAP = 5;
    const MODAL_MARGIN_HEIGHT = 80;

    const getTabId = (name: string) => `source-tab-${name}`;

    const getPanelId = (name: string) => `source-panel-${name}`;

    let props: SourceViewProps = $props();

    const viewportContext = getViewportContext();

    let loadToken = 0;

    let groups = $state.raw<SourceGroup[]>([]);
    let selectedGroup = $state.raw<SourceGroup>();
    let expandedNames = $state.raw<string[]>([]);

    const selectGroup = (group: SourceGroup | undefined) => {
        selectedGroup = group;
        expandedNames = group?.expandedNames ?? [];
    };

    const tabs = $derived(
        groups.map(
            (group): Tab<SourceGroup> => ({
                value: group,
                id: getTabId(group.name),
                panelId: getPanelId(group.name),
            }),
        ),
    );

    const items = $derived((selectedGroup?.files ?? []).map((file): AccordionItem<string> => ({ value: file.name })));

    const getSource = (name: string) => selectedGroup?.files.find((file) => file.name === name)?.source ?? "";

    $effect(() => {
        const path = props.path;

        untrack(() => {
            const token = ++loadToken;

            void SourceViewUtils.loadGroups(path).then((loaded) => {
                if (token !== loadToken) return;

                groups = loaded;
                selectGroup(loaded[0]);
            });
        });
    });
</script>

{#if selectedGroup}
    <div
        class={styles.sourceViewRoot}
        style:max-height={`${viewportContext.getSize().height - MODAL_MARGIN_HEIGHT}px`}
    >
        <div class={styles.sourceViewTabs}>
            <Scroller gap={TAB_GAP} padding={FOCUS_RING_WIDTH}>
                {#snippet renderButton(step, stepper)}
                    <PageScrollerButton {step} {stepper} />
                {/snippet}

                <Tabs
                    orientation={"horizontal"}
                    tabGap={TAB_GAP}
                    ariaLabel={"Source files"}
                    {tabs}
                    selectedValue={selectedGroup}
                    onSelectionChange={selectGroup}
                >
                    {#snippet renderGutter()}
                        <PageTabGutter orientation={"horizontal"} />
                    {/snippet}

                    {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
                        <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
                    {/snippet}

                    {#snippet renderTab(tab, flags)}
                        <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === selectedGroup}>
                            {tab.value.name}
                        </PageTabContent>
                    {/snippet}
                </Tabs>
            </Scroller>
        </div>

        <div class={styles.sourceViewPanel}>
            <PageTabPanel id={getPanelId(selectedGroup.name)} tabId={getTabId(selectedGroup.name)}>
                <Accordion {items} bind:expanded={expandedNames} gap={SECTION_GAP}>
                    {#snippet renderHeader(item, flags)}
                        <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
                    {/snippet}

                    {#snippet renderPanel(item, visibilityTarget, transitionDurationMs)}
                        <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                            <PageCodeBox source={getSource(item.value)} />
                        </PageAccordionPanel>
                    {/snippet}
                </Accordion>
            </PageTabPanel>
        </div>
    </div>
{/if}
