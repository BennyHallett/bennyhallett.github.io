---
layout: post
title:  "Keeping Phoenix Controllers Clean"
date:   2016-05-12 08:22:00 +1000
for:    blog
gaid:   "clean-controllers"
---

As I've been working on my recent Elixir project [Candle Maker
Pro](http://candlemakerpro.com), I've noticed an issue with the way that
controllers are generated in the [Phoenix
Framework](http://www.phoenixframework.org). In a way it's very similar to a
problem which I'm familiar with from Rails - Fat Controllers.

When you generate a controller in Phoenix, the routes that manipulate data
generally follow a pattern:

* Create changeset
* Insert / Save / Delete the record
* Use a case statement and pattern match the result
* Render or Redirect accordingly

This pattern is quite straight forward in itself, but falls down when we start
to do more complex things.

For example, if we want to manipulate several models and interact with the
Repo multile times, then the size of a function can increase considerably with
multiple case statements.

This problem is compounded once again when we have multiple actions within a
controller with this kind of complexity.

The solution that I've come across is very similar to the one that I use in
Rails. It involves moving all of the logic into a separate module (or modules), which I've
been calling `Operations`.

## Operations

The purpose of an Operation is to encapsulate a single behavior of an
application into a single module.

Think about the process of registering a user. It normally involves more than
just creating the model and saving it. Your process may involve:

* Correctly hashing the password
* Saving the user
* Generating a validation token
* Sending a validation email

Not to mention the various error handling paths.

In this case, keeping all of this logic in the controller would be too much, so
we use an operation.

### Well defined interface

Operations, as I use them, have well defined interfaces.

* An operation should be invoked with the parameters it needs to do it's work.
* It should return a tuple to be pattern matched on
* The return tuple should include all of the information the view requires to
  render (or be redirected)

I also try to avoid passing in the connection. If paths need to be
generated for rendering I normally do that inside the controller function.

Given these guidelines, we can go back to a process similar to the one the
generated controller actions use, except now any changes to the behaviour don't
increase the size of the controller function.

Here's an example of how we might handle that same user registration scenario.

```elixir
# web/operations/register_user.ex
defmodule Example.Operation.RegisterUser do
  def invoke(user_params) do
    User.changeset(%User{}, user_params)
    |> PasswordHasher.add_hashed_password
    |> Repo.insert
    |> process_insert
  end

  defp process_insert(result = {:error, cs}), do: result
  defp process_insert({:ok, user}) do
    {:ok, token} = ValidationToken.create_for(user)
    |> Repo.insert

    ValidationEmail.email(user, token)
    |> Emailer.deliver

    :ok
  end
end

# web/controllers/registration_controller.ex
  def register(conn, user_params) do
    alias Example.Operation.RegisterUser
    case RegisterUser.invoke(user_params) do
      {:error, cs} ->
        conn
        |> put_flash(:error, "An error occurred")
        |> render("register.html", changeset: cs)
      :ok ->
        conn
        |> put_flash(:info,"You're registered")
        |> redirect(:to, login_path(conn, :new))
    end
  end

```

In the example above, the controller action is now stripped back to a handful of
lines

This technique isn't revolutionary. It's pretty standard practice of separating
functionality out into different modules (or classes in an OO language). I think
however that explicitly calling this out on controller actions, and giving it a
name, helps to remind me to keep those controller actions as clean as possible.
