<script setup lang="ts">
import { useModel } from "vue";

import * as styles from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.css";

import type { NavMenuEntry, NavigationMenuExampleProps } from "../HoverCardPage.types";
import NavFlyout from "./NavFlyout.vue";

const ENTRIES: NavMenuEntry[] = [
    { key: "keep", label: "Keep" },
    {
        key: "armory",
        label: "Armory",
        links: [
            { key: "armory-blades", label: "Blades" },
            { key: "armory-shields", label: "Shields" },
            { key: "armory-mail", label: "Mail and plate" },
        ],
    },
    {
        key: "stables",
        label: "Stables",
        links: [
            { key: "stables-destriers", label: "Destriers" },
            { key: "stables-farriers", label: "Farriers" },
            { key: "stables-feed", label: "Feed and tack" },
        ],
    },
    { key: "chronicle", label: "Chronicle" },
];

const props = defineProps<NavigationMenuExampleProps>();

const openKey = useModel(props, "openKey");
</script>

<template>
    <nav aria-label="Castle">
        <ul :class="styles.navList">
            <li v-for="entry in ENTRIES" :key="entry.key">
                <NavFlyout
                    v-if="entry.links"
                    v-model:openKey="openKey"
                    :hover-show-delay-ms="hoverShowDelayMs"
                    :skip-delay-window-ms="skipDelayWindowMs"
                    :entry="entry"
                    :links="entry.links"
                />

                <a v-else :href="`#${entry.key}`" :class="styles.navLink">{{ entry.label }}</a>
            </li>
        </ul>
    </nav>
</template>
