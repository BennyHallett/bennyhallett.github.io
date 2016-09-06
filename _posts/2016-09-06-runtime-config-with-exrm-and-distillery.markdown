---
layout: post
title:  "Elixir runtime configuration with Exrm and Distillery"
date:   2016-09-06 17:30:00 +1000
for:    blog
gaid:   "elixir-runtime-config"
permalink: "/elixir-runtime-configuration-with-exrm-and-distillery/"
---

I'm currently working on an Elixir project and one of the problems that we have is runtime configuration.

_"Well that's easy, just use the config.exs files"_ you might say - and you wouldn't be wrong. Configuration is
really simple to setup in Elixir projects - it's built right into the core library. There is one caveat to
using this configuration however - and that is that the configuration is compiled with the rest of your application.
This makes it difficult to store configuration as environment variables - as outlined in the
[12 Factor App spec][twelve-factor]. Our configuration will end up with the values that existed at compile time, which
isn't exactly what we want when we're using tools like [Exrm][exrm-github] or [Distillery][distillery-github]

In Phoenix, [we have a ready-made solution][phoenix-config]. You can use the tuple `{:system, "VARIABLE_NAME"}` to  specify to
the framework that this should be evaluated at runtime. Alternatively there's a suggestion [from the
Plataformatec blog][plataformatec-solution] that allows us to use string values `"${VAR_NAME}"` in our config and
have them substitued at runtime.

Today I came across [a solution from Bitwalker][bitwalker-gist] - the creator of Exrm and Distillery. This solution
involves creating a `Config` module, that performs these evaluations for you at runtime and allows the definition
of default values. I think this is an awesome solution, as it allows us to hardcode `localhost` values in our dev
config and use environment variables in production.

I can also imagine extending this configuration module, so that it could also grab values from secret management
tools such as [Vault][vault-site]

I'd love to see this configuration module incorporated in the `Application` module of Elixir itself - there's
already 1 or 2 people asking for this on the gist.

[twelve-factor]: https://12factor.net
[exrm-github]: https://github.com/bitwalker/exrm
[distillery-github]: https://github.com/bitwalker/distillery
[phoenix-config]: https://github.com/phoenixframework/config
[plataformatec-solution]: https://blog.plataformatec.com/lalala
[bitwalker-gist]: https://gist.github.com/bitwalker/lalala
[vault-site]: https://hashicorp.com/vault
