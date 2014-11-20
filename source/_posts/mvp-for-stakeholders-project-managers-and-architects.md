title: "MVPs for Stakeholders,  Project Managers and Developers"
tags:
  - MVP
categories:
  - Software Development
date: 2014-11-20 14:01:09
---

## MVP - An Introduction

A **M**inimum **V**iable **P**roduct, in terms of software and product development, describes a process which
attempts to mitigate financial risk by bringing the bare minimal or the essence of an idea to market as soon as possible.

For software products an MVP development lifetime spans anywhere from a weekend to 30 or 60 days. 

Choice snippets from Wikipedia:

{% blockquote MVP http://en.wikipedia.org/wiki/Minimum_viable_product Wikipedia %}
  The minimum viable product (MVP) is the product with the highest return on investment versus risk.
  
  The product is typically deployed to a subset of possible customers, such as early adopters that are thought to be more 
  forgiving, more likely to give feedback, and able to grasp a product vision from an early prototype or marketing information. 
  
  **It is a strategy targeted at avoiding building products that customers do not want.**
{% endblockquote %}

For me, the last quote is the most significant as I have personal experience of this.

## A Personal Story - I Wish I Knew MVC Sooner

Being a software developer puts me in the fortunate position of being able to conceive an idea and execute the entire software 
development process by myself; a one-man-band, if you will. This means I can take an idea, design and develop all the necessary components such as: 
database design, hosting solutions, front-end and back-end code, etc...

This is a skill I took full advantage of in the last two decades, developing nearly a dozen personal projects and many more products for my clients and employers.
A dozen personal applications sounds prolific; it isn't, considering that only a small percentage of 
these were viable. For reference, most notable of these non viable products include:

* [MediaCMS](https://github.com/nazar/MediaCMS) - a media publishing website, enabling media owners to sell images, photos, videos and audio files. **Total Development Time: 12 months**.
* [RecipeTrees](https://github.com/nazar/recipetrees) - a recipe sharing website. **Development Time: 6 months**.
* [DarkFallSage](https://github.com/nazar/DarkFallSage) - a [mapwow](http://mapwow.com) like application but for the Dark Fall MMORPG.**Development Time: 4 months**.
  
I wouldn't call any of the above failures as  I didn't suffer financial loss, but time otherwise spent with loved ones, and in every instance, I took the opportunity to:
further hone and refresh my skill sets; and experiment with new technologies, platforms and frameworks.
  
If I were an entrepreneur with no aptitude for software development, instead hiring talent to develop the above, it would 
have been a **disaster** for one key reason: I failed to recognise early in the development process that none of these 
were viable products. 

Instead, **and this is key**, I mistook the lack of product popularity due to lack of features and committed 
more resources adding more of these. This is especially true for [MediaCMS](https://github.com/nazar/MediaCMS); it took me
a year to realise and accept that the product was not viable.

  
## MVP - A Reintroduction

After MediaCMS I realised that I had to spend less time in bringing a product to market to maximise my chances of success, which were increased 
if I were to develop five products in a year instead of just the one.

This, in my mind, is the essence of an MVP: take an idea and spend the least amount of resources to prove its worth. If an idea is a success, then build 
on that success; otherwise be brutally honest and abandon it.

Some Images I Googled that illustrate this:
                                                 
{% asset_img .center-image images/mvp-car.jpg %}
{% asset_img .center-image images/mvp-cake.jpg %}
{% asset_img .center-image images/mvp-batman.png %}
 
My advice, based on personal experience working on my own and client's products, are aimed at three different groups:

## The Stakeholder

This is your idea; you own it. It is either unique or a remix/re-iteration/evolution/amalgamation of an existing idea or ideas.

Your role is to establish product viability, be it through: market research; interviews and surveys; or via limited release.

Keep in mind that your resources (i.e. time/money) are ***very*** limited. The initial MVP software development focus should be on 
delivering a working product, with the least amount of features but enough to describe the core essence of your idea.

{% asset_img .center-image images/mvp-pyramid.png %}

I have personal experience of stakeholders dwelling on the functional aspect of the product and loosing track of the big picture. In all these instances
the outcome was the same: funds were depleted and development stalled leaving a non-functional product on the brink of launch.

### Advice


1. Establish the MVP's feature set and spend as much time as possible thinking through product processes and how the product is presented
 to your customers. Access to a UX/UI talent is key at this stage. 

1. As much of the theoretical work should be done before software development begins. Think of the software development process as a run-away train; 
 once the development process starts any deviations from course are time consuming and costly. 

1. Stay on target. The temptation to add features must be kept in check, especially if the development process is moving faster/better than anticipated.
 Although initial development is fast paced, this slows down towards the end, and especially in the last 90% of the development cycle, 
 also known as the [Ninety-ninety rule](http://en.wikipedia.org/wiki/Ninety-ninety_rule). This is real and must be accounted and budgeted for.  
 
1. Concentrate on as few platforms as possible. I've seen "MVP"s that are simultaneously developed for the web, iOS and Android
  platforms. Congratulations: you now have three run-away trains!

1. Budget for the un-expected. The software development process will over-run the original estimate despite all efforts.

1. Hire talent that specialises in Agile and in developing MVPs, someone like [Clevertech](http://www.clevertech.biz) for example.


## The Project Manager

You are the middle person between the Stakeholder and the talent that actualises the product. 
You are: Commander William Riker to Jean-Luc Picard; Darth Vader to Emperor Palpatine.

Your role is two fold:

1. Take the idea from the stakeholder and break it down into its smallest constituents. Each of these will be a single
 deliverable, taking more than a few days to complete. Iterate on this principle until the product is delivered.

1. Keep the Stakeholder in check and focused. Ward against feature creep. The stakeholder is human and we all find 
it difficult to realise we are digging ourselves into a hole. Saying ***no*** to feature requests is difficult but it is
your responsibility to assess the impact of each deviation or addition to the specification. These must always be
communicated to the client.


### Advice

1. Choose a project management tool that is capable of addressing your, the Stakeholder's and Developer's needs. Tools such as
 [Pivotal Tracker](http://pivotaltracker.com),  [Taiga](https://taiga.io), [Redmine](http://www.redmine.org), 
 [Jira](https://www.atlassian.com/software/jira) or even a [Github](https://github.com) issue tracker. This tool should
 at least provide the following features:
 * Define deliverables as stories or issues and the ability to categorise them (i.e. feature, bug, etc).
 * Ability to comment or attach files to issues.
 * Interface to the chosen [SCM](http://en.wikipedia.org/wiki/Source_control_management) (Git - _hint hint_) where all all source
  code commits can reference an issue by its number and that commit is recorded against the issue. This will serve as your source code
  documentation.

1. Adopt [Kanban](http://en.wikipedia.org/wiki/Kanban), [Agile](http://en.wikipedia.org/wiki/Agile_software_development) 
and [Lean](http://en.wikipedia.org/wiki/Lean_software_development) development methodologies. These processes encourage
   adaptive development processes that emphasise ***very*** short iteration cycles: build software in small incremental steps. 
   Your chosen project management tool ***must*** support the above processes.
    
1. Break development cycles into weekly sprints, with all work described in the project management tool as stories or issues. These stories
 must be in place at the start of the week and are typically discussed and agreed upon on the preceding Friday sprint deliverable meeting. 

1. Any work undertaken (i.e. cutting code, research, bug fixes, etc) ***must*** have a corresponding story or issue in the tracker. This discipline 
 must also be extended to the Developer where any code changes to the product must reference a story, no matter how trivial that change is.
 
1. Avoid using email for any technical discussions, especially if these discussion are related to software features. Instead use 
the project management tool for ***all*** discussions using the commenting feature. Current email clients make it difficult to find technical details in an ocean of email; 
 these are much easier to find if all discussions were recorded against specific stories (which in turn are referenced  
 in all code changes during commits). _Train the Stakeholder to do this early in the development process_.

1. Keep the Stakeholder informed on a ***daily*** basis. If you've chosen your project management tool wisely (i.e. not Microsoft Project) 
then the Stakeholder will have a real-time view of the development process.  


## The Software Developer

You make all this happen. You take a vague statement that describes an abstract concept and translates it into code.
 You are the Han Solos, Skywalkers, Datas, Gandalfs, Che Guevaras of this enterprise; minus all the glory.   
 
Your purpose is to deliver working code _as fast as possible_.  

### Advice

1. Use the language you are most proficient and comfortable with. Developing software for an MVP is the worst place
   to learn a new language.
   
1. Use a framework: i.e. [AngularJS](https://angularjs.org/), [Durandal](http://durandaljs.com/), [React](http://facebook.github.io/react), 
 [Express](http://expressjs.com/), [Eskimo](http://eskimo.io/), [Koa](http://koajs.com/), [Hapi](http://hapijs.com/), 
 [Rails](http://rubyonrails.org/), [Django](https://www.djangoproject.com/) etc... Any framework, provided you are proficient 
 and comfortable with it. Again, the pace of development expected for an MVP makes it less than ideal to get acquainted with a
 new framework.
     
1. Use a build system. [Grunt](http://gruntjs.com), [Gulp](http://gulpjs.com) or [Jake](http://jakejs.com) are examples
 of Javascript build systems that automate much of the mundane tasks. Several frameworks ship with built-in build tools 
 (i.e. [Rake](http://en.wikipedia.org/wiki/Rake_%28software%29) with [Rails](http://rubyonrails.org/).
      
1. Use a seed or a scaffolding tool such as [Yeoman](http://yeoman.io) or to do away with writing boilerplate code.
   
1. Use third-party libraries, components, plugins, engines etc as much as possible to avoid re-inventing the wheel. 

1. The core feature or component of the product should have the least amount of external dependencies. Ideally this should
be completely written from scratch as that provides complete flexibility in adjusting its function when requirements change (and I guarantee you they will).
 In my experience relying on third party code for the core feature becomes a road-block as someone other that you (i.e. the library author)
 has to add these features, something that is not always possible if their roadmap of the library differs from yours.
    
1. Concentrate on making your code readable instead of optimising it for speed. Recognise [premature optimization](http://c2.com/cgi/wiki?PrematureOptimization)
 and what a time vampire that can become. The critical factor in code is how easy it is to maintain by other developers, not how that for
  loop shaved nano seconds off iterating through a list of five items. Remember all the times you had to maintain such code and vow never to subject 
  that on anyone after you.
  
1. Write maintainable code. The temptation is strong in going full speed ahead and ignoring development principles 
like [SOLID](http://en.wikipedia.org/wiki/SOLID_(object-oriented_design)). Technical debt is real and it is frightening how easily it accumulates. In my experience, 
  an MVP's successor was never a greenfield project as time was always of the essence; Stakeholders rarely want to write-off their investment 
  in the MVP. Any code written after the MVP is launched will be based on the code that already exists. 



