$(function() {
  function init() {
    SE.init({
      clientId: 5421,
      key: 'GVFBSQMXrChv4cUS6T4q2g((',
      channelUrl: 'file:///Users/Ham/projects/BlizzTest/blank',
      complete: function () {
        dothis();
      }
    });

    $('#login-button').click(function() {
      SE.authenticate({
        success: function(data) { },
        error: function(data) { },
        scope: ['read_inbox'],
        networkUsers: true
      });
    });
  }
  function dothis(key) {
    loadQuestions(key);
  }
  init();
});


function loadQuestions(key) {
  console.log("Loading questions");
  $.ajax({
    type: 'GET',
    url: 'https://api.stackexchange.com/2.2/questions?pagesize=10&page=1&site=stackoverflow&filter=withbody',
    success: function(res) {
      renderQuestionCollection(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
};

function renderQuestionCollection(data) {
  var $listEls = [];
  var listLen = data.items.length;
  var i = 0;
  var $ul = $('<ul>');

  for (i; i <= listLen; i += 1) {
    $listEls.push(renderItem(data.items[i]));
  };
  $ul.addClass('list-group');
  $ul.append($listEls);
  $('#questions').append($ul);

}

function renderItem(item) {
  if (!item) {
    return
  }

  var $question = $('<li>');
  var $questionLink = $('<a>');

  $question.addClass('list-group-item');
  // $questionLink.attr('href', item.link);
  $questionLink.attr('data-id', item.question_id);
  // console.log($questionLink.data('id'));
  $questionLink.on('click', function(e) {
    e.preventDefault;
    loadDetail($(this).data('id'));
  });
  $questionLink.append(item.title);

  return $question.append($questionLink);
}

function loadDetail(id) {
  var question = $.ajax({
    type: 'GET',
    url: 'https://api.stackexchange.com/2.2/questions/' + id + '?site=stackoverflow&filter=withbody',
    success: function(res) {
      renderDetail(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
  var answers = $.ajax({
    type: 'GET',
    url: 'https://api.stackexchange.com/2.2/questions/' + id + '/answers/?site=stackoverflow&filter=withbody',
    success: function(res) {
      renderAnswers(res);
    },
    error: function(err) {
      console.log(err);
    }
  });
  console.log(question, answers);
}

function renderDetail(item) {
  var $wrapper = $('<div>').addClass('question-wrapper');
  var $title = $('<h3>').append(item.title);
  var $body = $('<div>').addClass('question-body');

  $body.append(item.items.body);
  $wrapper.append($title).append($body);

  console.log(item);

  return $('#question-detail').append($wrapper);
};

function renderAnswers(item) {
  if (!item) {
    console.log('No Answers');
    return
  }
  var $answers = [];
  var $wrapper = $('<div>').addClass('answers-wrapper');
  var $body = $('<div>').addClass('answer-body');

  for (var i = 0; i <= item.items.length; i += 1) {
    $body.append(item.items.body);
    $answers.push($body);

    console.log(item);
  }

  return $('#question-detail').append($wrapper);
}

















;;
