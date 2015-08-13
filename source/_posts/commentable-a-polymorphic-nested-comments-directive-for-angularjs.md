title: 'Commentable: a Polymorphic Nested Comments Directive for AngularJS'
tags:
  - AngularJS
  - Directives
  - Javascript
categories:
  - Software Development
date: 2013-05-30 11:00:00
summary:
---

This blog post is based on my experiences developing a Commentable widget (more on this later) first using [Backbone.js](http://backbonejs.org/) and more recently, [AngularJS](http://angularjs.org/).

## A Polymorphic Commentable Widget?

To be specific, it is:

+ some Javascript + HTML that allows a website visitor to add a comment on a specific page
+ the commenting functionality is not tied to any specific object. In other words, the same code can be used to comment against an Article, a Cat Photo or any business object without any modification
+ the same code should display previous comments in a nested fashion
+ provide a facility to reply to a comment
+ provide a facility to edit or delete any of your own comments

<!--more-->

### Source Code and Demo

This post is based on recent [parlmnt.com](http://parlmnt.com) [source code](https://github.com/nazar/parlmnt). The original Backbone implementation can be viewed on an older commit [here](https://github.com/nazar/parlmnt/tree/d5f4afb398b03ea1d23e7a2b473b860f9f238b7f/app/client/widgets/commentable).

The code described in this post is live on [parlmnt.com](http://parlmnt.com). The project's directives are defined [here](https://github.com/nazar/parlmnt/tree/master/app/assets/javascripts/app/directives)
 and sample templates that invoke this directive can be found [here](https://github.com/nazar/parlmnt/blob/master/app/views/templates/bills/show.html.erb)
 and [here](https://github.com/nazar/parlmnt/blob/master/app/views/templates/sponsors/show.html.erb).

A live comment can be seen against the [Equality Bill](http://parlmnt.com/#/bills/1341). Feel free to register (no email/identity information required) to add your comments.

## The Backbone.js Way

Backbone (plus other Javascript frameworks and jQuery) advocates an [Imperative](http://en.wikipedia.org/wiki/Imperative_programming) approach to defining a UI

Dynamic HTML elements are often rendered and appended into specific locations in the DOM,
often specified by a DOM Element ID or class name(s). This is not too disimilar from how jQuery, for example, is traditionally used to manipulate/render dynamic HTML.

A [sample code fragment](https://github.com/nazar/parlmnt/blob/d5f4afb398b03ea1d23e7a2b473b860f9f238b7f/app/client/widgets/commentable/views/comment.js#L53) in Backbone.js
could look something like:

{% codeblock Sample Imperative HTML Manipulation in Backbone.js lang:javascript %}
  _reply: function(e) {
    var that = this;

    e.preventDefault();

    if (!this._isReplying()) {

      if (sandbox.session.loggedIn()) {
        sandbox.template.render('commentable/templates/reply', {}, function (o) {
          //NOTE - Constructs an HTML fragment
          var $reply = sandbox
            .dom.$('<div class="reply"></div>');

          $reply.append(o);
          //NOTE - Appends dynamic HTML into specific location
          that.$el
            .find('.content-container:first')
            .append($reply.addClass('animated fadeInDown'));
        });
      } else {
        sandbox.publish('NeedRegistration');
      }
    }
  }
{% endcodeblock %}

Although Backbone.js has done a stirling job of bringing order/sanity in organising Javascript code (when compared the jQuery way) there still remains several issues:

+ general comprehension. Although Backbone has helped de-spaghettify Javascript in general the above code still requires some investigation/mental parsing to comprehend
+ the code is still coupled to the DOM; in the above code the `reply` HTML fragment is dependant on `.content-container` DOM Element's class. Unfortunately and in personal experience,
DOM structure and class names _ALWAYS_ change
+ although were are using HTML templates, it is Javascript code that determines state and solely controls how these templates are assembled according to state. These templates, in isolation, contain little meaning

## Introducing the AngularJS Way

I must confess that when I first started converting the Commentable Backbone.js widget into AngularJS I was still fixed in a DOM mindset; my Directive was full of CSS selectors that defined DOM targets for HTML fragment placement.
This quickly became cumbersome and I found myself working against AngularJS and towards a dead end.

AngularJS advocates a [Declarative](http://en.wikipedia.org/wiki/Declarative_programming) approach for building UIs. The following example should clarify this:

{% codeblock comment.html - Sample Declarative AngularJS Template  lang:html %}
  <div class="comment-container clearfix">
    <div class="content-container">
      <div ng-include=" '/templates/commentable/edit.html' "
           ng-show="comment.editing"></div>
      <div class="comment" ng-hide="comment.editing">
        <div class="stats">
          <span class="user">{%raw%}{{comment.username}}{%endraw%}</span>
          <time class="timeago"
                datetime="{%raw%}{{comment.created_at}}{%endraw%}">
            {%raw%}{{comment.created_at | date:'medium'}}{%endraw%}
          </time>
        </div>
        <p class="body">{%raw%}{{comment.body}}{%endraw%}</p>
      </div>
      <ul class="comment-actions unstyled clearfix">
        <li ng-show="loggedIn()">
          <a href="" ng-click="commentReply(comment)">reply</a>
        </li>
        <li ng-show="comment.mine">
          <a href="" ng-click="commentEdit(comment)">edit</a>
        </li>
        <li ng-show="comment.mine"><span confirm-delete-comment></span></li>
      </ul>
      <div ng-include=" '/templates/commentable/reply.html' "
           ng-show="comment.replying"></div>
    </div>
    //render child comments by invoking myself recursively
    <div class="comment clearfix"
         ng-repeat="comment in comment.children"
         ng-include=" '/templates/commentable/comment' "></div>
  </div>
{% endcodeblock %}

Note:

+ it is quickly apparent from the above code that two states exist in a comment: **editing** and **replying**. A further test `comment.mine` is made to determine whether the current logged in user owns the comment
+ it is also quickly apparent how each of these three states influence Element visibility
+ it is easier (and quicker) to comprehend the functionality of the above HTML without mentally parsing several Javascript files
+ crucially, all state based visibility logic is not tied to the DOM. A designer can add/remove CSS classes, even move elements with little risk of breaking functionality

Both `edit.html` and `reply.html` are trivial:

{% codeblock edit.html %}
  <textarea ng-model="comment.interact"
            placeholder="Edit comment..."
            cols="20"
            rows="1"></textarea>
  <div class="buttons">
    <button class="save btn btn-primary"
            ng-click="updateComment(comment)">Update</button>
    <button class="cancel btn"
            ng-click="cancelComment(comment)">Cancel</button>
  </div>
{% endcodeblock %}

{% codeblock reply.html %}
  <textarea ng-model="comment.interact"
            placeholder="Reply..."
            cols="20"
            rows="1"></textarea>
  <div class="buttons">
    <button class="save btn btn-primary"
            ng-click="replyComment(comment)">Save</button>
    <button class="cancel btn"
            ng-click="cancelComment(comment)">Cancel</button>
  </div>
{% endcodeblock %}

### A Reusable Component

The goal is to develop a Directive that injects a Commentable behaviour into a page.

{% codeblock Example Usage of Commentable lang:html%}
  <ul class="nav nav-tabs">
    <li class="active">
      <a href="" data-target="#summary" data-toggle="tab">Summary</a>
    </li>
    <li>
      <a href="" data-target="#comments"
                 data-toggle="tab">
        {%raw%}Comments({{bill.count_posts || 0}}){%endraw%}
      </a>
    </li>
  </ul>

  <div class="tab-content">
    <div id="summary" class="tab-pane active">
      <p ng-bind-html-unsafe="bill.bill_summary.body"></p>
    </div>
    //Comments Tab here
    <div id="comments" class="tab-pane" commentable="bill"
                                        commentable-type="Bill"
                                        src="billCommentsPath"
                                        logged-in="loggedIn()" ></div>
  </div>
{% endcodeblock %}

The above is a sample fragment of a Tab component with a Summary and a Comments tab. Crucially Comments are injected via the `commentable="bill"` attribute. Since polymorphic behaviour is
 required, the following additional data is supplied:

+ ** commentable="bill" **. Here `bill` is an object defined in the current scope
+ ** commentable-type="Bill" ** defines the object model name, required when comments are created on the server
+ ** src="billCommentsPath" ** defines the server endpoint from where existing comments will be retrieved for `bill`. This is defined in the current scope
+ ** logged-in="loggedIn()" **  the directive delegates the `loggedIn()` function call to the relevant scope in the inheritance chain

To summarise, the following line adds a commenting system to any database backed object being represented on screen:

{% codeblock Commentable Invocation lang:html %}
    <div commentable="bill"
         commentable-type="Bill"
         src="billCommentsPath"
         logged-in="loggedIn()" ></div>
{% endcodeblock %}

### The AngularJS Directive

The Commentable Directive's goals:

+ responsible for rendering comments for the object called `bill` in this instance
+ manage the comment's state. In essence, a `bill` doesn't or shouldn't care that a) it has comments nor b) what state each of these comments are in
+ communicate with the backend to create, update and retrieve comments. It is advantageous to have as much imperative logic contained in a single Javascript file so that it is easily reused across various projects
+ be completely isolated in the sense that scope property and function collisions are avoided for easier reusability

{% codeblock The Commentable Directive lang:javascript%}
angular.module('YourAppDependency').directive('commentable', [function() {

  return {

    templateUrl: '/templates/commentable/commentable', //HTML template.. see below

    scope: {  //isolate the scope
      commentable: '=',
      commentableType: '@',
      src: '=',
      loggedIn: '&'
    },

    controller: ['$scope', '$http', function($scope, $http) {
      var commentable = {};

      $scope.comments = [];
      $scope.formComment = {};

      $scope.$watch('src', function(path) {
        if (path) {
          commentable.getComments(path)
            .success(function(res) {
              $scope.comments = res.comments;
            });
        }
      });

      $scope.commentEdit = function(comment) {
        comment.interact = comment.body;
        comment.editing = true;
        comment.replying = false;
      };

      $scope.commentReply = function(comment) {
        comment.interact = '';
        comment.replying = true;
        comment.editing = false;
      };

      $scope.cancelComment = function(comment) {
        _commentResetState(comment);
      };

      $scope.createComment = function() {
        if ($scope.formComment.body) {
          commentable.createComment(
          $scope.commentableType,
          $scope.commentable, $scope.formComment.body)
            .success(function(response) {
              _resetFormComment();
              $scope.comments.push(response)
            })
        }
      };

      $scope.updateComment = function(comment) {
        commentable.updateComment(comment.id, comment.interact)
          .success(function(response) {
            _commentResetState(comment);
            Object.merge(comment, response.comment);
          });
      };

      $scope.replyComment = function(comment) {
        commentable.replyComment(comment.id, comment.interact)
          .success(function(response) {
            _commentResetState(comment);
            comment.children.push(Object.merge({
              replying: false,
              editing: false,
              interact: ''}, response.comment));
          });
      };

      $scope.deleteComment = function(comment) {
        commentable.deleteComment(comment.id)
          .success(function() {
            _commentResetState(comment);
            $scope.comments.remove(comment);
          });
      };

      //inline Commentable service

      commentable.getComments = function(path) {
        return $http.get(path);
      };

      commentable.createComment = function(
        commentableType, commentableObj, body) {

        var data = {
          comment: {
            commentable_type: commentableType,
            commentable_id: commentableObj.id,
            body: body
          }
        };

        return $http.post(Routes.comments_path(), data);
      };

      commentable.updateComment = function(commentId, commentBody) {
        var data = {
          comment: {
            body: commentBody
          }
        };

        return $http.put(Routes.comment_path(commentId), data);
      };

      commentable.replyComment = function(parentCommentId, commentBody) {
        var data = {
          comment: {
            body: commentBody
          }
        };

        return $http.post(Routes.reply_comment_path(parentCommentId), data);
      };

      commentable.deleteComment = function(commentId) {
        return $http.delete(Routes.comment_path(commentId, {method: 'delete'}));
      };


      /// PRIVATE

      //helpers
      function _resetFormComment() {
        $scope.formComment = null;
        $scope.formComment = {};
      }

      function _commentResetState(comment) {
        comment.replying = false;
        comment.editing = false;
      }

    }]
  };
}]);
{% endcodeblock %}

The Directive references the following template:

{% codeblock /templates/commentable/commentable.html lang:html %}
  <div class="commentable">
    <div ng-hide="loggedIn()">
      Please <span login-link></span> or
             <span register-link></span> to comment
    </div>
    <div ng-show="loggedIn()">
      <div class="add-comment">
        <textarea ng-model="formComment.body"
                  placeholder="Add Comment..."
                  cols="20" rows="2"></textarea>
        <div class="buttons">
          <button class="save btn btn-primary"
          ng-click="createComment()">Save</button>
        </div>
      </div>
    </div>
    //render comments
    <div class="comment clearfix"
         ng-repeat="comment in comments"
         ng-include=" '/templates/commentable/comment' "></div>
  </div>
{% endcodeblock %}

Crucially, the Commentable directive defines its own Controller which controls its templates in isolation to any Controllers on the page.

Further, the Directive also defines an inline Service object, `commentable`, to which it delegates all persistence activity. This can be advantageous in the future if the Directive is to be injected with a
 different service.

## Summary and Conclusion

The more I use AngularJS Directives the more I feel like this.

{% asset_img unlimitedpower.jpg Unlimited Powah %}

Directives greatly aid in approaching UI development from a component/widget mindset, where components are defined in Directives and/or Directive hierarchies and are easily re-used due to their highly
 decoupled nature. AngularJS greatly aids this by introducing concepts such as Scope Isolation.

This approach has been in use for employed in desktop software development where UI elements are often defined as standalone components. We are starting to see a this approach in
 web development with multiple techniques, like [Shadow Dom](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/), converging on this same principle.