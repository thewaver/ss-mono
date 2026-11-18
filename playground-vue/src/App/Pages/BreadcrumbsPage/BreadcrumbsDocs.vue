<script setup lang="ts">
import { shallowRef } from "vue";

import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    BREADCRUMB_SEPARATORS,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
import type { BreadcrumbSeparatorKey } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.types";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LinksDocsExample from "./Docs/Links.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const isDisabled = shallowRef(BreadcrumbKnobs.STARTING_IS_DISABLED);
const separator = shallowRef<BreadcrumbSeparatorKey>("/");
const hasLinkComponent = shallowRef(false);
</script>

<template>
    <PageDocsAlert severity="info">
        The separators here are only examples. Whatever you return from
        <span :class="docsStyles.docsPropName">renderSeparator</span> is drawn, so what sits between the crumbs is
        entirely yours: text, an icon, any markup.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" :separator="separator" />

        <template #renderKnobs>
            <PageProp item-key="separator" v-bind="BreadcrumbKnobs.SEPARATOR_TEXT">
                <PageSelectField
                    :value="separator"
                    :values="BREADCRUMB_SEPARATORS"
                    ariaLabel="Separator"
                    @change="(value: BreadcrumbSeparatorKey) => (separator = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="BreadcrumbKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.links" />

    <PageDocsExample :path="`${DOCS_ROOT}/Links.vue`">
        <LinksDocsExample :is-disabled="isDisabled" :has-link-component="hasLinkComponent" />

        <template #renderKnobs>
            <PageProp item-key="hasLinkComponent" v-bind="BreadcrumbKnobs.HAS_LINK_COMPONENT_TEXT">
                <PageCheckField
                    :value="hasLinkComponent"
                    ariaLabel="Custom link component"
                    @change="(value: boolean) => (hasLinkComponent = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
