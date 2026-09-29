<script setup lang="ts">
import { RichText } from "@thewaver/ss-components-vue";
import { TAG_DEFS } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";
</script>

<template>
    <div :class="styles.legendRoot">
        <div :class="styles.legendTitle">Default tags</div>

        <div :class="styles.legendGrid">
            <template v-for="tag in TAG_DEFS" :key="tag.tag">
                <span>
                    <span :class="styles.legendTag">{{ `[${tag.tag}]` }}</span>
                    <span>{{ tag.name }}</span>
                    <span :class="styles.legendTag">{{ `[/${tag.tag}]` }}</span>
                </span>

                <span>
                    <RichText :content="`[${tag.tag}]${tag.name}[/${tag.tag}]`" />
                </span>
            </template>
        </div>
    </div>
</template>
