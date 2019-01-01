let $root = $('html, body');

let articleMore = function() {
    $("article").each( function() {
        let articleID = $(this).attr("id");
        $("#" + articleID + " .article-more--link").click(function() {
            $("#" + articleID + " .article-content--all").toggle(500);
            $("#" + articleID + " .article-content--excerpt").toggle(500);
            $(this).find(".fa").toggleClass('fa-angle-double-down');
            $(this).find(".fa").toggleClass('fa-angle-double-up');
            $root.animate({
                scrollTop: $("#" + articleID).offset().top
            }, 500);
        });
    } );
}

export default articleMore;