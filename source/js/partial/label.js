let resetLabelStyle = function() {
    let tags = $(".label a");
    for (let i = 0, len = tags.length; i < len; i++) {
        let num = tags.eq(i).html().length % 5 + 1;
        tags[i].className = "";
        tags.eq(i).addClass("color" + num);
    }
}

export default resetLabelStyle;