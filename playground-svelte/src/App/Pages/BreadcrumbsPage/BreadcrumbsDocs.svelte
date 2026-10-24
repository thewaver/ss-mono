<script lang="ts">
    import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
    import {
        BREADCRUMB_SEPARATORS,
        DOCS_ROOT,
    } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
    import type { BreadcrumbSeparatorKey } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.types";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import LinksDocsExample from "./Docs/Links.svelte";

    let isDisabled = $state(BreadcrumbKnobs.STARTING_IS_DISABLED);
    let separator = $state<BreadcrumbSeparatorKey>("/");
    let hasLinkComponent = $state(false);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {isDisabled} {separator} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"separator"}
            label={"Separator"}
            hint={'What is drawn between the crumbs. The slot is yours: any markup works, and these are four examples. Choosing "none" leaves the slot out, so nothing sits between the crumbs and no empty element is rendered. Where drawn, it is hidden from assistive technology.'}
            controls={'Passes BreadcrumbsProps.renderSeparator, or omits it for "none"'}
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
            label={"Disabled"}
            hint={"Turns every crumb off: it refuses the press and says it is disabled, without the native attribute."}
            controls={"Sets Breadcrumb.isDisabled on every example crumb sent to BreadcrumbsProps.crumbs"}
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

<PageDocsSection title={"Links"}>
    Give a crumb an href and it is drawn as a native HTML anchor element, with the address passed through untouched. In a routed app, pass linkComponent, a custom link component such as your router's, and the crumbs are drawn with it instead.
</PageDocsSection>

<PageDocsExample path={`${DOCS_ROOT}/Links.svelte`}>
    <LinksDocsExample {isDisabled} {hasLinkComponent} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"hasLinkComponent"}
            label={"Custom link component"}
            hint={"Draws the crumbs with a custom link component, as a router's link would be. Off, they use the native HTML anchor element."}
            controls={"Sets BreadcrumbsProps.linkComponent"}
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
