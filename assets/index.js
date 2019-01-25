$(function() {

  var gleesonIds = 
  [
    'nm0322407',
    'nm1727304',
    'nm5489728',
    'nm2244852',
    'nm5490355'
  ]

  var queryParams =
  {
    token: 'c83bcc11-6f6b-4d46-bed1-9013ebceeef4',
    language: 'en-us',
    format: 'json',
    actors: 2
  }

  
  var onLoad = function()
  {
    var search = window.location.search.substring(1);
    if (search[search.length - 1] === '/') search = search.substring(0, search.length - 1);
    search = search.split('&');
    for (var i in search)
    {
      var param = search[i].split('=');
      if (param.length === 2 && param[0] === 'search')
      {
        var query = param[1].split('+').join(' ');
        $('#inputSearch').val(query);
        $('form').submit();
      }
    }
  }

  var getUrl = function(query, queryParams)
  {
    var url = 'https://www.myapifilms.com/imdb/idIMDB?title=' + query.split(' ').join('%20');
    for (key in queryParams) url += '&' + key + '=' + queryParams[key];
    return url;
  }

  var onFormSubmit = function(e)
  {
    e.preventDefault();
    var query = $(e.target).find('#inputSearch').val();
    if (!query) return doMessage('No results found');
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: getUrl(query, queryParams),
      success: onSearchSuccess
    });
    doMessage('Searching...');
  }

  var doMessage = function(text)
  {
    var message = $('<p>').text(text);
    $('#divResults').empty();
    $('#divResults').append(message);
  }

  var onSearchSuccess = function(data)
  {
    if (!data.data.movies.length)
      return doMessage('No results found');

    $('#divResults').empty();
    for (var i in data.data.movies)
      $('#divResults').append(getMovieDiv(data.data.movies[i]));
  }

  var getMovieDiv = function(movie)
  {
    var gleesons = getGleesons(movie.actors);
    var div = $('<div>');
    var title = $('<h4>').text(movie.title + ' (' + movie.year + ')');
    var stars = gleesons.stars;
    var plot = $('<p>').text(movie.simplePlot + " ");
    var link = $('<a>').text('imdb.com').attr('href', 'http://imdb.com/title/' + movie.idIMDB).attr('target', '_blank');
    var links = gleesons.links;
    title.append(stars);
    plot.append(link);
    div.append(title).append(plot).append(links);
    return div;
  }

  var getGleesons = function(actors)
  {
    var stars = $('<span>').addClass('spanStars');
    var links = $('<div>').addClass('divLinks');
    for (var i in actors)
    {
      for (var j in gleesonIds)
      {
        if (actors[i].actorId === gleesonIds[j])
        {
          var star = $('<span>').addClass('glyphicon glyphicon-star');
          var link = $('<a>').text(actors[i].actorName).attr('href', 'http://imdb.com/name/' + actors[i].actorId).attr('target', '_blank');
          stars.append(star);
          links.append(link);
        }
      }
    }
    var count = $(stars).children().length;
    for (var i = 0; i < (5 - count); i++)
    {
      var star = $('<span>').addClass('glyphicon glyphicon-star empty');
      stars.append(star);
    }
    return {stars: stars, links: links};
  }

  $('#buttonSearch').click(function(e) { $('form').submit(); })

  $('form').submit(function(e) { onFormSubmit(e); });

  onLoad();

});