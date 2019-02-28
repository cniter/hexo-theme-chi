function showTooltip(elem, msg) { 
    elem.setAttribute('data-toggle', 'tooltip');
    elem.setAttribute('title', msg); 
    $(elem).tooltip('enable');
    $(elem).tooltip('show');
    $(elem).tooltip('disable');
}

function copy(elem) {
    let clipboard = new ClipboardJS(elem);
    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        showTooltip(e.trigger, 'Copied!');
        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}

let copyClipboard = function() {
    $(".highlight-wrap").each(function(index) {
        let i = index + 1;
        $(this).attr("id","codeblock-" + i);
        $(this).attr("data-clipboard-target","#codeblock-" + i +" .code");
        copy("#codeblock-" + i);
    });

    copy(".copy-path");
}

export default copyClipboard;