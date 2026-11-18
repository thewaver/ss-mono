<script lang="ts">
    import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
    import { DOCS_SECTIONS,
        BREADCRUMB_SEPARATORS,
        DOCS_ROOT,
    } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
    import type { BreadcrumbSeparatorKey } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.types";
    import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LinksDocsExample from "./Docs/Links.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";

    let isDisabled = $state(BreadcrumbKnobs.STARTING_IS_DISABLED);
    let separator = $state<BreadcrumbSeparatorKey>("/");
    let hasLinkComponent = $state(false);
</script>

<PageDocsAlert severity="info">
    The separators here are only examples. Whatever you return from <span class={docsStyles.docsPropName}
        >renderSeparator</span
    > is drawn, so what sits between the crumbs is entirely yours: text, an icon, any markup.
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} {separator} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"separator"}
            {...BreadcrumbKnobs.SEPARATOR_TEXT}
        >
            <PageSelectField
                value={separator}
                values={BREADCRUMB_SEPARATORS}
                ariaLabel={"Separator"}
                onChange={(value) => {
                    separator = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...BreadcrumbKnobs.IS_DISABLED_TEXT}
        >
            <PageCheckField
                value={isDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.links}
/>

<PageDocsExample path={`${DOCS_ROOT}/Links.svelte`}>
    <LinksDocsExample {isDisabled} {hasLinkComponent} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasLinkComponent"}
            {...BreadcrumbKnobs.HAS_LINK_COMPONENT_TEXT}
        >
            <PageCheckField
                value={hasLinkComponent}
                ariaLabel={"Custom link component"}
                onChange={(value) => {
                    hasLinkComponent = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
