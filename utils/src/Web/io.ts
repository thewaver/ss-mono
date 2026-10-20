const ACCEPT_SEPARATOR = ",";
const EXTENSION_MARK = ".";
const MIME_SEPARATOR = "/";
const MIME_PARAMETER_SEPARATOR = ";";
const WILDCARD = "*";

const normalizeMime = (mime: string) => mime.split(MIME_PARAMETER_SEPARATOR)[0].trim().toLowerCase();

const isExtensionToken = (token: string) => token.startsWith(EXTENSION_MARK) && token.length > EXTENSION_MARK.length;

const isMimeToken = (token: string) => {
    const parts = token.split(MIME_SEPARATOR);

    return parts.length === 2 && parts.every((part) => part.length > 0);
};

const readAcceptTokens = (accept: string) =>
    accept
        .split(ACCEPT_SEPARATOR)
        .map((token) => normalizeMime(token))
        .filter((token) => isExtensionToken(token) || isMimeToken(token));

const matchesMimeToken = (token: string, type: string) => {
    if (!type) return false;

    const [tokenMain, tokenSub] = token.split(MIME_SEPARATOR);
    const [typeMain, typeSub] = normalizeMime(type).split(MIME_SEPARATOR);

    return (tokenMain === WILDCARD || tokenMain === typeMain) && (tokenSub === WILDCARD || tokenSub === typeSub);
};

export namespace IOUtils {
    /**
     * Saves a value to the user's machine as a JSON file.
     *
     * Serializes the value, hands the browser a temporary link and clicks it. Anything
     * `JSON.stringify` cannot represent — functions, `undefined`, circular references —
     * is dropped or throws, exactly as it would anywhere else.
     *
     * Browser only. The temporary link is cleaned up straight afterwards.
     *
     * @param filename The name to suggest in the save dialog. Include the `.json`
     * extension yourself; nothing is appended.
     * @param content The value to save.
     */
    export const downloadJson = (filename: string, content: object) => {
        const blob = new Blob([JSON.stringify(content)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.download = filename;
        downloadLink.href = url;
        downloadLink.click();

        URL.revokeObjectURL(url);
    };

    /**
     * Tests whether a file passes a file input's `accept` list, as the browser's file picker reads it.
     *
     * The list is comma-separated, and a file passes when it fits any entry: an extension such as `.png`, matched
     * against the end of the file's name; a MIME type such as `image/png`; or one with a wildcard half such as
     * `image/*`. Case, spaces and MIME parameters (`; charset=utf-8`) are ignored, and so is any entry that is
     * neither an extension nor a MIME type. A file with no type can only pass by its extension.
     *
     * Works on anything with a name and a type, not only a `File`, so it runs outside a browser too.
     *
     * @param file The file, or its name and type.
     * @param accept The `accept` list. Missing, or holding no entry the browser would honor, accepts everything.
     */
    export const matchesAccept = (file: { name: string; type: string }, accept: string | undefined) => {
        const tokens = accept === undefined ? [] : readAcceptTokens(accept);

        if (!tokens.length) return true;

        const name = file.name.toLowerCase();

        return tokens.some((token) =>
            isExtensionToken(token) ? name.endsWith(token) : matchesMimeToken(token, file.type),
        );
    };
}
