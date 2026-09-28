import type { JSX } from "solid-js";

import { RichText } from "@thewaver/ss-components-solid";
import { toOwnAppHref } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import { LINKS_CONTENT } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

const LINK_ATTRIBUTES = { a: ["href"] };

const SAFE_HREF_RE = /^(https:\/\/|\/(?!\/)|#)/;

const renderLinkTag = (tag: string, renderChildren: () => JSX.Element, attributes: Record<string, string>) =>
    tag === "a" && SAFE_HREF_RE.test(attributes.href ?? "") ? (
        <a href={toOwnAppHref(attributes.href)} class={styles.link}>
            {renderChildren()}
        </a>
    ) : undefined;

export const LinksExample = () => (
    <div class={styles.proseText}>
        <RichText content={LINKS_CONTENT} allowedAttributes={LINK_ATTRIBUTES} renderTag={renderLinkTag} />
    </div>
);
