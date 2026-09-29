<script setup lang="ts">
import { RichText } from "@thewaver/ss-components-vue";
import { toOwnAppHref } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import { LINKS_CONTENT } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

const LINK_ATTRIBUTES = { a: ["href"] };

const SAFE_HREF_RE = /^(https:\/\/|\/(?!\/)|#)/;
</script>

<template>
    <div :class="styles.proseText">
        <RichText :content="LINKS_CONTENT" :allowed-attributes="LINK_ATTRIBUTES">
            <template #renderTag="{ tag, renderChildren, attributes }">
                <a
                    v-if="tag === 'a' && SAFE_HREF_RE.test(attributes.href ?? '')"
                    :href="toOwnAppHref(attributes.href)"
                    :class="styles.link"
                >
                    <component :is="renderChildren" />
                </a>
            </template>
        </RichText>
    </div>
</template>
