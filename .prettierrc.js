module.exports = {
    arrowParens: 'always',
    printWidth: 100,
    quoteProps: 'consistent',
    singleQuote: true,
    endOfLine: 'lf',
    tabWidth: 4,
    trailingComma: 'all',
    bracketSpacing: true,
    vueIndentScriptAndStyle: true,
    bracketSameLine: true,

    overrides: [
        {
            files: '*.{yaml,yml}',
            parser: 'yaml',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.json',
            parser: 'json',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
