<script setup lang="ts">
import { shallowRef } from "vue";

import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
import {
    BREADCRUMB_SEPARATORS,
    DOCS_ROOT,
} from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
import type { BreadcrumbSeparatorKey } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.types";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LinksDocsExample from "./Docs/Links.vue";

const isDisabled = shallowRef(BreadcrumbKnobs.STARTING_IS_DISABLED);
const separator = shallowRef<BreadcrumbSeparatorKey>("/");
const hasLinkComponent = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" :separator="separator" />

        <template #renderKnobs>
            <PageProp
                item-key="separator"
                label="Separator"
                hint='What is drawn between the crumbs. The slot is yours: any markup works, and these are four examples. Choosing "none" leaves the slot out, so nothing sits between the crumbs and no empty element is rendered. Where drawn, it is hidden from assistive technology.'
                controls='Passes BreadcrumbsProps.renderSeparator, or omits it for "none"'
            >
                <PageSelectField
                    :value="separator"
                    :values="BREADCRUMB_SEPARATORS"
                    ariaLabel="Separator"
                    @change="(value: BreadcrumbSeparatorKey) => (separator = value)"
                />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns every crumb off: it refuses the press and says it is disabled, without the native attribute."
                controls="Sets Breadcrumb.isDisabled on every example crumb sent to BreadcrumbsProps.crumbs"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection title="Links">
        Give a crumb an href and it is drawn as a native HTML anchor element, with the address passed through untouched.
        In a routed app, pass linkComponent, a custom link component such as your router's, and the crumbs are drawn
        with it instead.
    </PageDocsSection>

    <PageDocsExample :path="`${DOCS_ROOT}/Links.vue`">
        <LinksDocsExample :is-disabled="isDisabled" :has-link-component="hasLinkComponent" />

        <template #renderKnobs>
            <PageProp
                item-key="hasLinkComponent"
                label="Custom link component"
                hint="Draws the crumbs with a custom link component, as a router's link would be. Off, they use the native HTML anchor element."
                controls="Sets BreadcrumbsProps.linkComponent"
            >
                <PageCheckField
                    :value="hasLinkComponent"
                    ariaLabel="Custom link component"
                    @change="(value: boolean) => (hasLinkComponent = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
