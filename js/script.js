
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // GOOGLE STREETVIEW API
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // NYTIMES API
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=5a8e90cfe416492ab572f8010f8b8e9b'

    $.getJSON(nytimesUrl, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + 
                '<a href="' + article.web_url+'">' + article.headline.main +
                    '</a>' + 
                '<p>' + article.snippet + '</p>' + 
            '</li>');
        };
    }).fail(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    //WIKIPEDIA API 
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+cityStr+'&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType:"jsonp",
        success: function( result ){
            var articleList = result[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i] 
                var url = 'https://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href="'+url+'">' + articleStr + '</a></li>');
                
            };

            clearTimeout(wikiRequestTimeout);
        }
    }) 

    return false;
};

$('#form-container').submit(loadData);
