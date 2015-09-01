title: "Modelling Symmetrical Relationships with Bookshelf.js"
tags:
  - Bookshelf.js
  - Javascript
  - Node.js
  - ORM
categories:
  - Software Development
summary:
---

Whilst developing  [Soapee](http://soapee.com) I received a feature request that [Recipes](http://soapee.com/recipes) should either be defined as *public*, *private* or only visible to *friends* -
by default recipes were *public*.

Follows is a post on how I modeled *Friendships* using [Bookshelf.js](http://bookshelfjs.org) with [PostgreSQL](http://www.postgresql.org/) in
**Soapee's** Express based [API Server](https://github.com/nazar/soapee-api).

But first, a primer on **symmetric** and **asymmetric** friendships.

## Friendship Relationships

*Friendship* relationships describe a model in which users in a relational database form relationships between other users.

Generally these fall into two categories:

### Asymmetric Relationships

{% asset_img asymmetric-relationship.gif %}

An asymmetric *friendship* relation is best exemplified by Twitter where users form the following relationships with each other:

+ **Followers** - users that follow you but you don't follow them back
+ **Following** - users that you follow but they don't follow you back
+ **Friends** - users that you follow and they follow you back
+ **None** - neither follows the other


### Symmetric Relationships

{% asset_img symmetric-relationship.gif %}

A symmetric *friendship* relation is best illustrated by Facebook where specific visibility permissions are applicable only when a two users are friends - i.e. they follow each other.

The following relationships exist between facebook users:

+ **Sent** friend requests - friend requests you have sent but have not been approved yet
+ **Received** friend requests - a user requested to be your friend but you have not yet approved it
+ **Friends** - two users have "friended", and approved, each other
+ **None** - no relationship exists between two users

Facebook provides security/privacy settings in which certain content is only accessible to "Friends" only hence the need to model and distinguish that relationship specifically.

For **Soapee** I need to model **symmetric relationships** as I required to identify *friends* in order to limit recipe visibility. My implementation follows:

## Symmetric Friendship Table Structure

This example uses **PostgreSQL** with [Bookshelf.js](http://bookshelfjs.org) but the same concepts apply if using MySQL, for example.

{% codeblock Frienships table DDL lang:sql %}
CREATE TABLE public.friendships (
  id SERIAL,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT friendships_pkey PRIMARY KEY(id),
  CONSTRAINT friendships_prevent_duplicate_requests UNIQUE(user_id, friend_id)
)
WITH (oids = false);

CREATE INDEX friendships_friend_id_index ON public.friendships
  USING btree (friend_id);
{% endcodeblock %}

## Friendship Bookshelf.js Models

There are few ways in which  symmetric and asymmetric relationships can be modelled in an RDBMS. Generally this involves a `users` table which associates to itself via a `friendships` table.
In other words, the `users` table forms a **many-to-many** relationship to itself via the `friendships` table.

**Bookshelf.js** provides the [belongsToMany](http://bookshelfjs.org/#Model-instance-belongsToMany) method which defines a **Join Model**
with which the [through](http://bookshelfjs.org/#Model-instance-through) method can be used to query users via an association.

I've extracted relevant **Friendship** and **User** models and relation definitions from **Soapee's** API server - the full models can be viewed [here](https://github.com/nazar/soapee-api/tree/master/src/models).

### Friendship

{% codeblock Friendship Bookshelf Model Excerpt lang:javascript %}
import bookshelf from 'db/bookshelf';
import { User } from 'models/user';

export let Friendship = bookshelf.Model.extend( {
    tableName: 'friendships',

    user() {
        return this.belongsTo( User );
    },

    friend() {
        return this.belongsTo( User, 'friend_id' );
    }
} );
{% endcodeblock %}

### User

{% codeblock User Bookshelf Model Excerpt lang:javascript %}
import bookshelf from 'db/bookshelf';
import { Friendship } from 'models/friendship';
import { Recipe } from 'models/recipe';

export let User = bookshelf.Model.extend( {
    tableName: 'users',

    recipes() {
        return this.hasMany( Recipe );
    },

    /**
     * Symmetric friendship relationships
     */
    friends() {
        return this
            .belongsToMany( User )
            .through( Friendship, 'friend_id', 'user_id' )
            .query( qb => {
                qb.whereRaw( `exists(
                                 select 1
                                 from friendships f
                                 where f.friend_id = friendships.user_id
                                 and f.user_id = friendships.friend_id )`
                );
            } );
    },

    /**
     * Other people requesting to be friends with me but I
     * have yet to approve their friend requests
     */
    pendingIncomingFriendRequests() {
        return this
            .belongsToMany( User )
            .through( Friendship, 'friend_id', 'user_id' )
            .query( qb => {
                qb.whereRaw( `not exists(
                                 select 1
                                 from friendships f
                                 where f.friend_id = friendships.user_id
                                 and f.user_id = friendships.friend_id )`
                );
            } );
    },

    /**
     * Me requesting to be friends with other people and
     * they have yet to approve the friendship request
     */
    pendingOutgoingFriendRequests() {
        return this
            .belongsToMany( User )
            .through( Friendship, 'user_id', 'friend_id' )
            .query( qb => {
                qb.whereRaw( `not exists(
                                  select 1
                                  from friendships f
                                  where f.friend_id = friendships.user_id
                                  and f.user_id = friendships.friend_id )`
                );
            } );
    }
} );
{% endcodeblock %}

In the `User` model, the **pendingIncomingFriendRequests** and **pendingOutgoingFriendRequests** relations are provided for illustrative purposes. The key relationship is **friends**.

Using the above model, a **friends** relationship exists only when the `Friendship` model contains two rows: one entry for each of the two users in the relationship.

The two rows are populated by a `User` first making a request. Once the request is approved, a second row is inserted. Conversely, a friendship can be broken by
either party by deleting the relevant *friends* row.


## Retrieving Friend's Recipes

<div id="friend-example">
{% codeblock retrieving friends' recipes function extract lang:javascript %}
function getUserFriendsWithRecipes() {
    return User
        .forge( {
            id: this.userId
        } )
        .fetch( {
            withRelated: [
                'friends.recipes'
            ]
        } );
}
{% endcodeblock %}
</div>

The above function, given a userId, will retrieve a specific user and will also eager-load the specific user's **friends** and their **recipes**. Note that recipes are attached to
friends but a simple **lodash** [reduce](https://lodash.com/docs#reduce), already [built-into](http://bookshelfjs.org/#Collection-subsection-lodash-methods) **Bookshelf.js**,
is able to collect all recipes from the returned *friends* [collection](http://bookshelfjs.org/#section-Collection).

The key relation here is **friends**,
which will return any relation defined on the `User` model, but that belong to friends. If, for example, we wished to return all our friend's comments:

{% codeblock retrieving friends' recipes lang:javascript %}
function getUserFriendsWithRecipes() {
    return User
        .forge( {
            id: this.userId
        } )
        .fetch( {
            withRelated: [
                'friends.comments'
            ]
        } );
}
{% endcodeblock %}

**Soapee's** [User](https://github.com/nazar/soapee-api/blob/master/src/models/user.js) model defines additional relations (such as **status update** for example) which can all be
eager loaded through **friends**.

## Restricting Friend's Recipes by Privacy Settings

I'll finish with an example that I hope illustrates how flexible **Bookshelf.js** is in both defining and querying relationships.

The `friends.recipes` [example](#friend-example) has a minor issue in that it returns ***all*** our friend's recipes, even if these were marked as private.
We should only be returning recipes with visibility set to either *public* or *friend*.

The `getUserFriendsWithRecipes` function can be modified as follows:

{% codeblock retrieving friends' recipes lang:javascript %}
function getUserFriendsWithRecipes() {
    return User
        .forge( {
            id: this.userId
        } )
        .fetch( {
            withRelated: [
                {
                    'friends.recipes': qb => {
                        qb.where( 'recipes.visibility', '>', 0 );
                    }
                }
            ]
        } );
}}
{% endcodeblock %}

Note, in the above `recipes.visibility` 0 is *private*, 1 is *public* and 2 is *friends only*.

Bookshelf's [fetch](http://bookshelfjs.org/#Model-instance-fetch) model method takes a `withRelated` *option* which allows specifying relations to lazy load.
This *option* can specify either a model name or a model name and function key value pair; the latter variant can be supplied a function in which
the underlying **knex.js** [query](http://knexjs.org/#Builder) can be further queried.

## Conclusion

I hope I've shown that **Bookshelf.js** makes it easy (and IMHO fun) to define and query model relationships. As an additional resource, please feel free to review
*Soapee's* model [implementations](https://github.com/nazar/soapee-api/tree/master/src/models) and how these models are [queried](https://github.com/nazar/soapee-api/tree/master/src/services/data).
