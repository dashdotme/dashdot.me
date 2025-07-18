---
title: "Cloudflare's Transparency Deserves More Credit"
date: 2025-07-18
description: "Cloudflare's recent post-mortem was great, but it highlights that we've made the web more brittle."
tags:
  - devops
  - networking
  - cloud
layout: post.liquid
permalink: /cloudflare-deserve-more-credit/
---
Cloudflare took parts of the web down again a few days ago, in another outage. [Their response](https://blog.cloudflare.com/cloudflare-1-1-1-1-incident-on-july-14-2025/) can't get enough credit: it was clear, concise and quickly delivered.

The details told a painful and familiar story. A mistake was made in a networking configuration update a month earlier; because the related configuration wasn't yet 'live', nothing happened. A second update then pulled the pin over a month later.

This second update, adding an inactive location, also looked harmless to production - but it triggered a global configuration refresh. So began many bad days in the office, as everything routed by Cloudflare starts to drop from the internet (again).

The impressive part of the story is that Cloudflare had service restored within an hour. That's a huge win for Cloudflare's rollback protocol. Nobody was untangling the root cause there in under an hour.

A second highlight was Cloudflare parsing out the noise of what looked like a cyber attack, revealed during the outage. When things aren't working and businesses are on the line, blame is an easy distraction. Cloudflare's engineers and managers correctly set it aside, minimizing the confusion.

There's no explanation yet for the apparent BGP hijack - essentially, a third party pretending to be Cloudflare and redirecting their traffic. But there doesn't need to be; it was incidental - a separate and much lower priority problem revealed by the outage. That's the nature of operations - any number of things can happen during your incident. You've got to be laser focused.

What always matters most is whether it can happen again. So can it?

The short answer here is yes, it can. Human input into large, complicated systems is risky. Recent large-scale outages all seem to look like this - some piece of global infrastructure relies on a configuration system; the configuration system is brittle to some input; an engineer or team of engineers enter input which **looks** typical and safe; the misconfiguration breaks the system, and everything which depends on it.

This is a big argument **against** hyperscale infrastructure providers, especially in the short term. They have modernised operations, invented efficient layers of abstraction and engineered data centers that are more reliable than ever - but the software powering these global systems has been invented quickly, in ways that can break.

In spite of that, cloud margins are extreme, while SLA-breach payments are carefully capped. It's individual businesses and people which lose through these incidents - and the irony there is, it's businesses which need the safety of the hyperscaler brands. If your service is only down while everything else is down, you're safe.

So Cloudflare's post is the best case handling of this kind of problem - a many-billion dollar business admitting their core systems have brittle components. They can only replace them over time.

With that in mind, Cloudflare has my trust - not because I think these problems will be solved tomorrow, but because [everyone has them](https://www.thousandeyes.com/resources/internet-outages-timeline). They're easy to create, and hard to solve.

And while I understand the pragmatism of keeping quiet - more transparency gives people more to remember - I'd wager that it's the companies which speak up that will fix things, and quickly. Their business now depends on it.
