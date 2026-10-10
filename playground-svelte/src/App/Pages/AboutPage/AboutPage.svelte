<script lang="ts">
    import { AboutPageUtils } from "@thewaver/ss-playground/App/Pages/AboutPage/AboutPage.utils";

    import PageArticle from "../../PageComponents/Article/Article.svelte";
    import { OWN_FRAMEWORK } from "../../PageComponents/FrameworkMenu/FrameworkMenu.const";

    const SECTIONS = AboutPageUtils.computeSections(OWN_FRAMEWORK);
</script>

<PageArticle title={"About"} view={"about"} sections={SECTIONS} />
