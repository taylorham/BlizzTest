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
    e.preventDefault;
    searchQuestions($('#search').val());
  });

  $('#search').keyup(function(e) {
    e.preventDefault;
    if (event.keyCode == 13) {
      $('#search-button').click();
    }
  });

}); // END DOCUMENT READY

function loadQuestions(key) {
  console.log("Loading questions");
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
  var $questionsList = [];
  var questionCount = data.items.length;
  var $ul = $('<ul>');

  for (i = 0; i <= (questionCount - 1); i += 1) {
    $questionsList.push(renderQuestion(data.items[i]));
  };
  $ul.addClass('list-group');
  $ul.append($questionsList);
  $('#questions').append($ul);

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
    url: 'https://api.stackexchange.com/2.2/search?key=' + apiKey + '&site=stackoverflow&order=desc&intitle=' + search,
    success: function(res) {
      renderSearchList(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function renderSearchList(data) {

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
  console.log(question, answers);
}

function renderDetail(data) {
  var $wrapper = $('<div>').addClass('question-wrapper');
  var $title = $('<h3>').html('Question: ').append(data.items[0].title);
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
    console.log('No Answers');
    return
  } else {
    console.log('Answers: ' + answerCount);
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
  var $answerNumber = $('<h3>').html('Answer #' + count);
  var $answer = $('<div>').addClass('answer').html(answer.body);

  return $answerContainer.append($answerNumber, $answer);
}

















;;
