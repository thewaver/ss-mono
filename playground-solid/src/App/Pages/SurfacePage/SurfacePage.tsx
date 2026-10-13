import { createMemo } from "solid-js";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { AvatarExample } from "./Examples/Avatar/Avatar";
import { BannerExample } from "./Examples/Banner/Banner";
import { CardExample } from "./Examples/Card/Card";

export const SurfacePage = () => {
    const getExamples = createMemo(() => {
        return [
            {
                key: "avatar",
                name: EXAMPLE_NAMES.avatar,
                component: () => <AvatarExample />,
                path: `${EXAMPLES_ROOT}/Avatar/Avatar.tsx`,
            },
            {
                key: "banner",
                name: EXAMPLE_NAMES.banner,
                component: () => <BannerExample />,
                path: `${EXAMPLES_ROOT}/Banner/Banner.tsx`,
            },
            {
                key: "card",
                name: EXAMPLE_NAMES.card,
                component: () => <CardExample />,
                path: `${EXAMPLES_ROOT}/Card/Card.tsx`,
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PageExamples items={getExamples} />
        </div>
    );
};
