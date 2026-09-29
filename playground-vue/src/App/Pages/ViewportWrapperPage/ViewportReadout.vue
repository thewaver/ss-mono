<script setup lang="ts">
import { useViewportContext } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ViewportWrapperPage/ViewportWrapperPage.css";

const context = useViewportContext();
</script>

<template>
    <div :class="[styles.readout, styles.cornerReadout]" data-inner-readout="">
        {{
            `${context.getScale().toFixed(2)}× of ${Math.round(context.getSize().width)}×${Math.round(context.getSize().height)}`
        }}
    </div>
</template>
