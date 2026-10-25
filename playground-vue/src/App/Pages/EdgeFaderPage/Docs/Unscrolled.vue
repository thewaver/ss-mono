<script setup lang="ts">
import { EdgeFader } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.css";
</script>

<template>
    <div :class="styles.docsCardFrame">
        <EdgeFader>
            <div :class="styles.card">
                <h3 :class="styles.cardTitle">Nothing to scroll</h3>
                <p :class="styles.cardText">Everything in this card fits inside it.</p>
            </div>
        </EdgeFader>
    </div>
</template>
