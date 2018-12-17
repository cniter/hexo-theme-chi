// refer to: [Hexo 博客美化代码块](https://blog.ihoey.com/posts/Hexo/2018-05-27-hexo-code-block.html)

var attributes = [
    'autocomplete="off"',
    'autocorrect="off"',
    'autocapitalize="off"',
    'spellcheck="false"',
    'contenteditable="false"'
]

var attributesStr = attributes.join(' ')

hexo.extend.filter.register('after_post_render', function (data) {
    while (/<figure class="highlight ([a-zA-Z]+)">.*?<\/figure>/.test(data.content)) {
        data.content = data.content.replace(/<figure class="highlight ([a-zA-Z]+)">.*?<\/figure>/, function () {
            var language = RegExp.$1 || 'CODE'
            var lastMatch = RegExp.lastMatch
            lastMatch = lastMatch.replace(/<figure class="highlight/, '<figure class="highlight ')
            return '<div class="highlight-wrap"' + attributesStr + 'data-lang="' + language.toUpperCase() + '">' + lastMatch + '</div>'
        })
    }
    return data;
})