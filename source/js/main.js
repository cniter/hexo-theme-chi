import resetLabelStyle from './partial/label.js';
import articleShowMore from './partial/article.js';
import copyClipboard from './widget/copy.js';

$(document).ready(function () {
    resetLabelStyle();
    articleShowMore();
    copyClipboard();
});