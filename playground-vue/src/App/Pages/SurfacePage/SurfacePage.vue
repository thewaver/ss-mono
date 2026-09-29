<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import AvatarExample from "./Examples/Avatar/Avatar.vue";
import BannerExample from "./Examples/Banner/Banner.vue";
import CardExample from "./Examples/Card/Card.vue";

const EXAMPLES_ROOT = "/src/App/Pages/SurfacePage/Examples";

const EXAMPLES: ExampleDefs[] = [
    {
        key: "avatar",
        name: "Avatar",
        path: `${EXAMPLES_ROOT}/Avatar/Avatar.vue`,
    },
    {
        key: "banner",
        name: "Banner",
        path: `${EXAMPLES_ROOT}/Banner/Banner.vue`,
    },
    {
        key: "card",
        name: "Card",
        path: `${EXAMPLES_ROOT}/Card/Card.vue`,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PageExamples :items="EXAMPLES">
            <template #avatar>
                <AvatarExample />
            </template>

            <template #banner>
                <BannerExample />
            </template>

            <template #card>
                <CardExample />
            </template>
        </PageExamples>
    </div>
</template>
