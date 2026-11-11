const COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
const IMPORTANT_PATTERN = /\s*!important\s*$/i;

const splitDeclarations = (cssText: string) => {
    const declarations: string[] = [];
    let current = "";
    let depth = 0;
    let quote = "";

    for (const character of cssText) {
        if (quote) {
            if (character === quote) quote = "";
        } else if (character === '"' || character === "'") {
            quote = character;
        } else if (character === "(") {
            depth++;
        } else if (character === ")") {
            depth = Math.max(0, depth - 1);
        }

        if (character === ";" && depth === 0 && !quote) {
            declarations.push(current);
            current = "";
        } else {
            current += character;
        }
    }

    declarations.push(current);

    return declarations.map((declaration) => declaration.trim()).filter((declaration) => declaration !== "");
};

const getIsDeclarationValid = (declaration: string) => {
    const colonIndex = declaration.indexOf(":");

    if (colonIndex <= 0) return false;

    const property = declaration.slice(0, colonIndex).trim();
    const value = declaration
        .slice(colonIndex + 1)
        .replace(IMPORTANT_PATTERN, "")
        .trim();

    return value !== "" && CSS.supports(property, value);
};

export namespace ShapePageUtils {
    export const findInvalidCssDeclarations = (cssText: string) =>
        splitDeclarations(cssText.replace(COMMENT_PATTERN, "")).filter(
            (declaration) => !getIsDeclarationValid(declaration),
        );
}
