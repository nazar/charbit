title: DRYing AngularJS Directives
date: 2013-06-03 11:45
comments: true
tags: [AngularJS, Directives, Javascript]
categories: [Software Development]
---

This is a short follow-up post based on [Reusable Bootstrap Modal Forms](/2013/05/30/commentable-a-polymorphic-nested-comments-directive-for-angularjs/) in which I described how an
 AngularJS Directive can be used to encapsulate a number of templates and configurations to present a re-usable Bootstrap Modal form.

<!--more-->

{% codeblock navbar snippet lang:html %}
<ul class="nav pull-right" ng-controller="sessionsController">
  <li ng-show="loggedIn">
    ...
  </li>
  <li ng-hide="loggedIn">
    <ul class="nav">
      <li>
        <a href="#" form-modal template="/templates/sessions/register.html"
                                 title="Register"
                                 ok-button-text="Register"
                                 form-submit="register()"
                                 form-object="user"
                                 form-errors="errors">
          Register
        </a>
      </li>
      <li>
        <a href="#" form-modal template="/templates/sessions/login.html"
                                 title="Login"
                                 ok-button-text="Login"
                                 form-submit="login()"
                                 form-object="user"
                                 form-errors="errors">
            Login
        </a>
      </li>
    </ul>
  </li>
</ul>
{% endcodeblock %}

The post concluded with the above HTML template that showed how the same directive `form-modal` is used to present both a **Login** and a **Registration** modal using the `form-modal` Directive.

## DRYer Directives

Although `form-modal` hides much detail, there is still potential for further encapsulation as the directive currently requires six attributes. This can become laborious, error prone and unnecessary when
 multiple Login/Registration links are required throughout the application.

Ideally, the HTML template should be:

{% codeblock DRYer navbar snippet lang:html %}
<ul class="nav pull-right" ng-controller="sessionsController">
  <li ng-show="loggedIn">
    ...
  </li>
  <li ng-hide="loggedIn">
    <ul class="nav">
      <li><span register-link></span></li>
      <li><span login-link></span></li>
    </ul>
  </li>
</ul>
{% endcodeblock %}

Where `register-link` and `login-link` each encapsulate `form-modal` with the correct attributes.

{% codeblock LoginLink Directive lang:javascript %}
angular.module('parlmntDeps').directive('loginLink', [function() {

  return {
    replace: true,
    template: ' <a href="#" form-modal template="/templates/sessions/login.js" '+
              ' title="Login" ok-button-text="Login" form-submit="login()" '+
              ' form-clear="clear()" form-object="formUser" form-errors="errors">Login</a> '
  }

}]);
{% endcodeblock %}

`replace: true` is the key as it instructs the Directive to replace the Element, `span` in this case, with the specified template, which is simply the original `form-modal` from the previous code
 iteration.

## Thoughts and Conclusions

AngularJS Directives provide a powerful facility in which configurable directives could be further specialised.

This suggests a pattern in which Directives could be designed to be configurable (where appropriate) which in-turn are then specialised through simpler directives providing the following advantages:

+ DRYer code. It is less error prone (and quicker) to specify `<login-link>` than the original `form-modal` +six attributes declaration
+ changes to the base directive automatically filter to the specialised directives. Want to replace the base modal with another Modal implementation in the future? It should be a simple as
changing the `form-modal` implementation