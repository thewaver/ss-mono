<script setup lang="ts">
import { AboutPageUtils } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.utils";

import PageArticle from "../../PageComponents/Article/Article.vue";
import { OWN_FRAMEWORK } from "../../PageComponents/FrameworkMenu/FrameworkMenu.const";

const SECTIONS = AboutPageUtils.computeGettingStartedSections(OWN_FRAMEWORK);
</script>

<template>
    <PageArticle title="Getting started" view="getting-started" :sections="SECTIONS" />
</template>
