/**
 * Импорт модуля из текста
 * @param moduleText - js-код
 */
export function doImport (moduleText: string) {
    if (!!globalThis.URL.createObjectURL) {
        const blob = new Blob([moduleText], { type: 'text/javascript' })
        const url = URL.createObjectURL(blob)
        const module = import(/* webpackIgnore: true */ url)
        URL.revokeObjectURL(url) // GC objectURLs
        return module
    }

    const url = "data:text/javascript;base64," + btoa(moduleText)
    return import(url)
}
