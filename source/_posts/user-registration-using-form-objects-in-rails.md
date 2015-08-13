title: User Registration From Scratch using Form Objects in Rails
tags:
  - Rails
  - Patterns
  - Form Object
categories:
  - Software Development
date: 2013-05-13 14:33:00
summary:
---

I recently watched a presentation by [Bryan Helmkamp](https://twitter.com/brynary) titled [Refactoring Fat Models with Patterns](http://www.youtube.com/watch?feature=player_embedded&v=IqajIYxbPOI). Bryan based
 his talk on his blog [7 Patterns to Refactor Fat ActiveRecord Models](http://blog.codeclimate.com/blog/2012/10/17/7-ways-to-decompose-fat-activerecord-models/), in which he describes seven
 patterns used to simplify models and adhere to the [Single Responsibility Principle](http://www.objectmentor.com/resources/articles/srp.pdf). I highly recommend studying both these resources.

From the patterns Bryan described, the **Form Object** pattern struck a chord as it seemed to be an elegant solution for a problem I have developed multiple
implementations for but never felt completely satisfied with the result. I refer to **User Registration** and the lesser issue of **User Authentication**.

## Does User Registration Logic Belong in a Model?

IMHO, no because registration/signup is a one-off event for a `User` yet code responsible for this remains in the `User` class and must be accounted for whenever a `User` object is instantiated during testing.

This becomes even more apparent when additional validation could be required during registration that rely on remote services (i.e. lookup the user's IP against a spammer blacklist). Adding
 this logic to the User model (be it in a method or ActiveRecord callback) adds external dependencies to the `User` class which again must be accounted for during testing.

<!--more-->

Typically, user registration involves the following steps:

+ Validate correctness of username and password with checks that restrict lengths, formats and uniqueness of each
+ add virtual properties to a class (i.e. password)
+ add methods to generate both a salt and an encrypted password

A sample implementation based on `authenticated_system`, which expects the `User` class to contain the following implementation:

{% codeblock User class with Registration logic example lang:ruby %}
class User < ActiveRecord::Base
  #for password encryption
  require 'digest/sha1'

  # user registration logic specific callback
  before_save { |record| record.encrypt_password }

  # Virtual attribute for the unencrypted password
  attr_accessor :password #only required during registration

  # The following four validations are only required during
  # registration and are disabled during all other user operations via password_required?
  validates_presence_of :password, :if => :password_required?
  validates_presence_of :password_confirmation, :if => :password_required?
  validates_length_of :password, :within => 4..40, :if => :password_required?
  validates_confirmation_of :password, :if => :password_required?

  # Authenticates a user by their login name and
  # unencrypted password. Returns the user or nil.
  def self.authenticate(login, password)
    u = find_by_login(login) # need to get the salt
    u && u.authenticated?(password) ? u : nil
  end

  # Encrypts some data with the salt.
  def self.encrypt(password, salt)
    Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  # Encrypts the password with the user salt
  def encrypt(password)
    self.class.encrypt(password, salt)
  end

  def authenticated?(password)
    crypted_password == encrypt(password)
  end

  protected
  # before filter
  def encrypt_password
    return if password.blank?
    self.salt = Digest::SHA1.hexdigest("--#{Time.now.to_s}--#{login}--") if new_record?
    self.crypted_password = encrypt(password)
  end

  def password_required?
    return false unless self.shibboleth_id.blank? && self.identity_url.blank?
    crypted_password.blank? || !password.blank?
  end

end
{% endcodeblock %}

Although convenient, the above just made our tests more complex as there are now additional validations that must be accounted for when writing `User` tests.

Additionally, the registration logic is tightly coupled to the `User` class and cannot be easily re-used.

## Is There a Better Way?

Bryan describes a **Form Object** as:

>When multiple ActiveRecord models might be updated by a single form submission, a Form Object can encapsulate the aggregation.

Using a **Form Object** would mean that:

+ The User registration process is encapsulated by a single and truly re-usable class
+ All user registration and authentication code no longer needs to reside in the `User` model having less impact on testing

## An Example

We'll be using the following **User Registration** story:

* a user can register using a username and password
* the username must be unique
* username and password must be valid
* store an encrypted version of the salted password
* check the user's IP against [stopforumspam.com](http://www.stopforumspam.com) to determine if this is a known bot or spammer

The `User` class:

{% codeblock Simpler User class lang:ruby %}
class User < ActiveRecord::Base
  validates :username, :uniqueness => true
  validates :email, :uniqueness => true
end
{% endcodeblock %}


`UserRegistrator` is a Ruby Class that implements all our `User` story requirements.

{% codeblock UserRegistrator Form Object lang:ruby %}
class UserRegistrator

  #for password encryption
  require 'digest/sha1'

  #for anti-spam checks
  require 'net/http'
  require 'uri'

  include Virtus # see https://github.com/solnic/virtus

  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include ActiveModel::Validations #tasty validations

  #expose the @user once persisted
  attr_reader :user

  #define Virtus accessors
  attribute :username, String
  attribute :password, String             # password virtual property never touches user
  attribute :encrypted_password, String
  attribute :salt, String
  attribute :ip, String

  #user registration specific validations
  validates :username, :length => {:minimum => 3}
  validates :password, :length => {:minimum => 6}
  validates :password, :confirmation => true

  validate :not_spammer
  validate :unique_username


  def persisted?
    false
  end

  def save
    if valid?
      persist!
      true
    else
      false
    end
  end

  def to_json(options)
    {:user => {:username => username, :id => @user.id}}.to_json
  end

  private

  def persist!
    encrypt_password
    @user = User.create!(:username => username,
                         :salt => salt,
                         :encrypted_password => encrypted_password,
                         :ip => ip)
  end

  def encrypt_password
    self.salt = Digest::SHA1.hexdigest("+--#{random_string(50) +
      (Time.now + rand(10000)).to_s + random_string(50)}-+")
    self.encrypted_password = Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  def random_string(len)
    rand_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" <<
      "0123456789" <<
      "abcdefghijklmnopqrstuvwxyz"

    rand_max = rand_chars.size
    srand
    ''.tap do |ret|
      len.times{ ret << rand_chars[rand(rand_max)] }
    end
  end

  def not_spammer
    query = "http://www.stopforumspam.com/api?ip=#{ip}&f=json"
    Rails.logger.info "Querying StopForumSpam: #{query}"
    #build http
    uri = URI.parse(query)
    response = Net::HTTP.get_response(uri)
    Rails.logger.info "Queried StopForumSpam: #{response.body}"
    #parse response.body
    parsed = ActiveSupport::JSON.decode(response.body)
    if (parsed['success'] == 1)
      && parsed['ip']
      && (parsed['ip']['appears'] > 0)
      && ((parsed['ip']['frequency'] > 0))
      errors.add(:ip, 'Cannot register: spam activity previously detected.')
    end
  end

  def unique_username
    if User.where(:username => username).count(1) > 0
      errors.add(:username, 'has already been taken')
    end
  end

end
{% endcodeblock %}

Note:

+ `UserRegistrator` Includes `include ActiveModel::Validations` which provides the `errors` array, which a **Controller** can use to report any registration specific errors
+ Password encryption, salting and related virtual properties are all kept out of the `User` class as are the `stopforumspam.com` checks

The `SessionsController` then becomes:

{% codeblock SessionsController lang:ruby %}
class SessionsController < ApplicationController
  def register
    @signup = UserRegistrator.new(params[:user].merge(:ip => request.remote_ip))

    if @signup.save
      self.current_user = @signup.user
    end

    json_responder(@signup)  # @signup contains .errors and Virtus attributes,
                             # which makes it convenient to respond with either
                             # an object or object.errors. @signup also has a to_json
                             # property which serialises the json response
  end

  protected

  def json_responder(obj)
    #only interested in json
    respond_to do |format|
      format.json {render :json => obj}
    end
  end
end
{% endcodeblock %}