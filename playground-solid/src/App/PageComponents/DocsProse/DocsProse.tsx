import { RichText } from "@thewaver/ss-components-solid";
import {
    DOCS_PROSE_ALLOWED_ATTRIBUTES,
    DOCS_PROSE_WCAG_TAG,
} from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { toDocsProseClasses, toWcagHref } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.utils";

import type { PageDocsProseProps } from "./DocsProseSolid.types";

export const PageDocsProse = (props: PageDocsProseProps) => (
    <RichText
        content={props.content}
        allowedAttributes={DOCS_PROSE_ALLOWED_ATTRIBUTES}
        computeClassNames={toDocsProseClasses}
        renderTag={(tag, renderChildren, attributes) => {
            if (tag !== DOCS_PROSE_WCAG_TAG) return undefined;

            const href = toWcagHref(attributes.id);

            return href === undefined ? undefined : <a href={href}>{renderChildren()}</a>;
        }}
    />
);
