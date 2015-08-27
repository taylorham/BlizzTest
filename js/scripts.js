// API KEY GLOBAL VARIABLE
if (window.location.href.indexOf('http://localhost:8000') >= 0) {
  // DEV API INFO
  var apiKey = 'GVFBSQMXrChv4cUS6T4q2g((';
  var clientId = 5421;
  var channelUrl = 'http://localhost:8000/blank';
} else {
  // PROD API INFO
  var apiKey = 'nLaoZdEl2BJtCKLR8X4plQ((';
  var clientId = 5457;
  var channelUrl = 'http://taylorham3d.com/BlizzTest/blank';
}

jQuery.extend({
  getQueryParameters : function() {
    return (window.location.hash).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
  }
});

$(function() {

  SE.init({
    clientId: clientId,
    key: apiKey,
    channelUrl: channelUrl,
    complete: function() {
      loadQuestions(apiKey);
    }
  });

  checkLoggedIn();

  $('#search-button').on('click', function(e) {
    console.log($('#search').val());
    searchQuestions($('#search').val());
  });

  $('#search').keyup(function(e) {
    if (event.keyCode == 13) {
      e.preventDefault;
      $('#search-button').click();
    }
  });

  $('#search-form').submit(function(e) {
    return false;
  });

  $('#search').focus();

}); // END DOCUMENT READY

function loadQuestions(key) {
  console.log("Loading questions...");
  $.ajax({
    type: 'GET',
    url: 'https://api.stackexchange.com/2.2/questions?key=' + key + '&pagesize=10&page=1&site=stackoverflow&filter=withbody',
    success: function(res) {
      renderQuestionCollection(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
};

function checkLoggedIn() {
  var params = $.getQueryParameters();
  var accessToken = params['#access_token'];

  if (accessToken) {
    renderLoggedIn(accessToken);
  } else {
    $('#login-button').on('click', function(e) {
      var href = 'https://stackexchange.com/oauth/dialog?client_id=5421&scope=write_access&redirect_uri=http://localhost:8000';
      window.open(href);
    });
  }
}

function renderQuestionCollection(data) {
  $('#questions-list').remove();
  var $questionsList = [];
  var questionCount = data.items.length;
  var $ul = $('<ul>').addClass('list-group').attr('id', 'questions-list');

  for (i = 0; i <= (questionCount - 1); i += 1) {
    $questionsList.push(renderQuestion(data.items[i], i));
  };
  $ul.append($questionsList);
  $('#questions').append($ul);

  console.log('Questions loaded.');

}

function renderQuestion(item, i) {
  if (!item) {
    return
  }

  var $question = $('<li>').addClass('list-group-item');
  var $questionLink = $('<a>').attr('data-id', item.question_id);
  var title = (i + 1) + '. ' + item.title;

  $questionLink.on('click', function(e) {
    e.preventDefault;
    loadDetail($(this).data('id'));
  });
  $questionLink.append(title);

  return $question.append($questionLink);
}

function searchQuestions(search) {
  $.ajax({
    type: 'GET',
    url: 'https://api.stackexchange.com/2.2/search?key=' + apiKey + '&site=stackoverflow&order=desc&intitle=' + search + '&pagesize=10&page=1',
    success: function(res) {
      renderQuestionCollection(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function loadDetail(id) {
  var question = $.ajax({
    type: 'GET',
    url: 'https://api.stackexchange.com/2.2/questions/' + id + '?site=stackoverflow&filter=withbody&key=' + apiKey,
    success: function(res) {
      $('.question-wrapper, .answers-wrapper').remove();
      renderDetail(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
  var answers = $.ajax({
    type: 'GET',
    url: 'https://api.stackexchange.com/2.2/questions/' + id + '/answers/?site=stackoverflow&filter=withbody&key=' + apiKey,
    success: function(res) {
      renderAnswerCollection(res, id);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function renderDetail(data, id) {
  console.log('Loading question: "' + data.items[0].title + '"...');

  var $wrapper = $('<div>').addClass('question-wrapper');
  var $title = $('<h2>').html('Question: ').append(data.items[0].title);
  var $body = $('<div>').addClass('question-body');
  var $votes = $('<div>').attr('id', 'question-voting');
  var voteHtml =  '<div class="vote-up glyphicon glyphicon-thumbs-up"><p>vote up</p></div>'
                + '<div class="vote-down glyphicon glyphicon-thumbs-down"><p>vote down</p></div>'
                + '<div class="star glyphicon glyphicon-star"><p>favorite</p></div>';

  $votes.append(voteHtml);
  $body.append(data.items[0].body);
  $wrapper.append($votes).append($title).append($body);

  return $('#question-detail').append($wrapper);
};

function renderAnswerCollection(data, id) {
  voteFunctions(id);

  var $answersList = [];
  var answerCount = data.items.length;
  var $wrapper = $('<div>').addClass('answers-wrapper');

  if (answerCount <= 0) {
    var $noAnswers = $wrapper.append($('<h2>').html('No Answers'));

    console.log('Question loaded. No answers.');
    $('#question-detail').append($wrapper);
    return
  } else {
    console.log('Question loaded. ' + answerCount + ' answers.');
  }

  for (var i = 0; i <= (answerCount - 1); i += 1) {
    $answersList.push(renderAnswer(data.items[i], i));
  }

  $wrapper.append($answersList);
  $('#question-detail').append($wrapper);
}

function renderAnswer(answer, i) {
  if (!answer) {
    return
  }

  var count = i + 1;
  var $answerContainer = $('<div>').addClass('clearfix');
  var $answerNumber = $('<h2>').html('Answer #' + count);
  var $answer = $('<div>').addClass('answer').html(answer.body);

  return $answerContainer.append($answerNumber, $answer);
}

function renderLoggedIn(token,exp) {
  $('#login-button').addClass('hide');
  $('#logout-button').removeClass('hide');
}

function voteFunctions(id) {
  var params = $.getQueryParameters();
  var accessToken = params['#access_token'];

  $('.vote-up').on('click', function(e) {
    var vote = $.ajax({
      type: 'POST',
      url: 'https://api.stackexchange.com/2.2/questions/' + id + '/upvote',
      data: {
        site: 'stackoverflow',
        key: apiKey,
        access_token: accessToken
      },
      success: function(res) {
        console.log($(this));
        $(this).toggleClass('active');
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
}

















;;
