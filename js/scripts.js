// API KEY GLOBAL VARIABLE
var apiKey = 'GVFBSQMXrChv4cUS6T4q2g(('

$(function() {

  SE.init({
    clientId: 5421,
    key: apiKey,
    channelUrl: 'file:///Users/Ham/projects/BlizzTest/blank',
    complete: function () {
      loadQuestions(apiKey);
    }
  });

  $('#login-button').click(function() {
    SE.authenticate({
      success: function(data) {
        alert(
          'User Authorized with account id = ' +
          data.networkUsers[0].account_id + ', got access token = ' +
          data.accessToken
        );
      },
      error: function(data) {
        alert('An error occurred:\n' + data.errorName + '\n' + data.errorMessage);
      },
      scope: ['read_inbox'],
      networkUsers: true
    });
  });

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

function renderQuestionCollection(data) {
  $('#questions-list').remove();
  var $questionsList = [];
  var questionCount = data.items.length;
  var $ul = $('<ul>').addClass('list-group').attr('id', 'questions-list');

  for (i = 0; i <= (questionCount - 1); i += 1) {
    $questionsList.push(renderQuestion(data.items[i]));
  };
  $ul.append($questionsList);
  $('#questions').append($ul);

  console.log('Questions loaded.');

}

function renderQuestion(item) {
  if (!item) {
    return
  }

  var $question = $('<li>');
  var $questionLink = $('<a>');

  $question.addClass('list-group-item');
  // $questionLink.attr('href', item.link);
  $questionLink.attr('data-id', item.question_id);
  $questionLink.on('click', function(e) {
    e.preventDefault;
    loadDetail($(this).data('id'));
  });
  $questionLink.append(item.title);

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

function renderSearchList(data) {
  console.log(data);
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
      renderAnswerCollection(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function renderDetail(data) {
  console.log('Loading question: "' + data.items[0].title + '"...')

  var $wrapper = $('<div>').addClass('question-wrapper');
  var $title = $('<h2>').html('Question: ').append(data.items[0].title);
  var $body = $('<div>').addClass('question-body');

  $body.append(data.items[0].body);
  $wrapper.append($title).append($body);

  return $('#question-detail').append($wrapper);
};

function renderAnswerCollection(data) {
  var $answersList = [];
  var answerCount = data.items.length;
  var $wrapper = $('<div>').addClass('answers-wrapper');

  if (answerCount <= 0) {
    var $noAnswers = $('<h2>').html('No Answers');

    console.log('Question loaded. No answers.');
    $('#question-detail').append($noAnswers);
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
  var $answerContainer = $('<div>');
  var $answerNumber = $('<h2>').html('Answer #' + count);
  var $answer = $('<div>').addClass('answer').html(answer.body);

  return $answerContainer.append($answerNumber, $answer);
}

















;;
