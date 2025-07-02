---
title: "Nix Doesn't Have To Be Hard"
date: 2025-06-29
description: "Nix doesn't have to be hard. Here are five principles to simplify your learning curve."
tags:
  - nix
  - linux
  - devops
layout: post.liquid
permalink: /nix-doesnt-have-to-be-hard/
---
Honestly, it doesn't.

Of course it can be. Between the custom language, the litany of optional features, the novel approaches to packaging and configuration, the tweaks to Linux conventions, the lack of consensus on structure and all the jargon to express everything `Nix` - you can burn weeks.

But to actually get things done? To get a working machine, customize it with the latest and greatest in the Linux ecosystem, then copy it around your other hosts? To start using Nix dev environments? Really, it's not that complicated.

This is my entire Nix repo tree:

```bash
.
├── cfg-home-only.nix
├── cfg-xps-only.nix
├── configuration-darwin.nix
├── configuration-linux.nix
├── configuration-shared.nix
├── flake.lock
├── flake.nix
├── hardware-home.nix
├── hardware-xps.nix
├── home.nix
├── mounts-home.nix
├── mounts-xps.nix
└── README.md
```

These are the files used by the laptop I'm writing this on:

```bash
.
├── cfg-xps-only.nix
├── configuration-linux.nix
├── configuration-shared.nix
├── flake.lock
├── flake.nix
├── hardware-xps.nix
├── home.nix
└── mounts-xps.nix
```

And these are my code statistics for those files:

## Overview

| Language | Files | Blanks | Code | Comments | Total Lines |
| -------- | ----- | ------ | ---- | -------- | ----------- |
| Nix      | 7     | 87     | 495  | 71       | 653         |

## Breakdown

| File                     | Blanks | Code | Comments | Total Lines |
| ------------------------ | ------ | ---- | -------- | ----------- |
| configuration-linux.nix  | 32     | 177  | 47       | 256         |
| home.nix                 | 28     | 176  | 18       | 222         |
| flake.nix                | 7      | 58   | 0        | 65          |
| hardware-xps.nix         | 7      | 25   | 5        | 37          |
| cfg-xps-only.nix         | 9      | 24   | 1        | 34          |
| mounts-xps.nix           | 3      | 19   | 0        | 22          |
| configuration-shared.nix | 1      | 16   | 0        | 17          |

500 lines of Nix configuration, 150 lines of documentation and whitespace. That's a pretty tiny project, yet it has all the important parts of my OS, and most of it is reused across 3 machines.

<figure style="flex: 1; margin: 0;">
  <img src="/assets/2025-06-29-nix-doesnt-have-to-be-hard/comfy_mode.webp" alt="Comfy Mode" style="width: 100%; height: auto;">
  <figcaption>My PC in comfy mode</figcaption>
</figure>

That limited scope is true of any Nix config I've looked at. Some do clever, complex things; some manage the complication of many hosts; some structure things to be as modular as possible - but the **system is never large**.

That small scale means *you're free to keep things simple*. You don't need to abstract, or learn every detail - you don't need a textbook to get started. You can learn more practically, by giving it a go, solving problems you actually have, and iterating.

With that said, Nix comes with no shortage of rabbit holes you might fall down along the way. To help you steer clear, I've come up with five principles for starting out, along with a handful of definitions for Nix jargon.

## One: Understand what you're building

Like infrastructure code, your Nix configuration is mapping out a **dependency graph** - *this is what my PC needs to function.* That's what Nix is. That's the problem it solves.

All the clever parts - reproducibility, rollbacks, temporary package installs, isolated dev shells and a life with minimal dependency conflicts - those come from implementation details. They're mostly free - you don't need to understand them right away.

Because of this, a key programming principle applies - **structure things as simply as possible. Design for future you.**

Nobody is going to stop you from building a complex system, but the question you should ask is - is it worth it? In two years, as you're setting up a new machine, you're the one who will have to understand it all again.

## Two: You don't need every feature

You especially don't need to understand every Nix-ism. Nix comes with a wonderfully engaged community who have made difficult things work and documented their abstractions in detail. **Their problems and goals aren't yours.** In many cases, **it's simpler to avoid the problems they're trying to solve**.

As an example - Nix doesn't manage my dotfiles. Instead, I use a tool called chezmoi. It does exactly one thing - manage my dotfiles - and it does it well, in a way that's familiar - regardless of my OS.

Trying to use Nix for this purpose instead unveiled a heap of complexity. Worse, it was **locking me in**, without adding value. As far as I can tell, it's one of those things you don't need to do.

<figure style="flex: 1; margin: 0;">
    <img src="/assets/2025-06-29-nix-doesnt-have-to-be-hard/productive_mode.webp" alt="Productive Mode" style="width: 100%; height: auto">
    <figcaption>My PC in productive mode</figcaption>
</figure>

## Three: Nix's abstractions leak

Okay, this isn't news - all abstractions leak. But by making your configuration explicit, Nix unearths a lot of Linux detail.

There's no way around it - you're going to learn a lot as you go here. Whether that's understanding your choice of audio server, the source of your graphics drivers, or the different components that make up your desktop environment, Nix's declarative approach makes every choice explicit.

Other OS's come with implicit defaults. You don't have to think about it. This is easier, until you want to change things.

With Nix, it's all clearly *your problem*. That reveals another way you can understand your Nix configuration - it's maybe fifty or a hundred choices about your PC *that you like*.

One key advantage to this is that **all edge cases are clearly documented.**

For example, the laptop I'm using has something weird - the audio mixer sometimes gets muted on startup. I added a quick work-around - a service that unmutes it a few times - and I've had zero issues since.

A year from now though, that fix might be irrelevant, or it might create new bugs. Maybe I've updated the audio mixer from another machine, and I've forgotten about my service; maybe it's started causing a crash.

Nix makes this maintenance easy. The bug lives in my centralized configuration, in a file specific for this laptop. Every line there is something I wrote. If I have a problem, I know exactly where to look first.

I might still cause the bug, and maybe it will still be bad - but I can always rollback, read my code, and remove the problem. That's a  small but nice win which comes from Nix's declarative approach, along with their *build generations*.

## Four: Nix isn't flawless

This is a key one to understand - Nix makes choices that, out of the box, break things. Productive use requires a handful of workarounds; initial installation is comparatively hard, requiring you to format your own partitions; Nix-specific documentation can be rough, and the language is complicated. But, once you're up and running, it works better than anything else.

One big issue is that it's easy to go wrong before you're on this happy path. The rabbit holes go deep. The tech debt is plentiful.

As an example, let's look at **dynamic linking**. It's a fundamental OS concept, used to save resources, which doesn't *just work* on Nix. You'll see it mentioned at the heart of quite a few **'I Quit Nix!'** stories online.

In reality a simple solution exists, provided at the end of the explanation below. But let's try to understand why people say *Nix is hard*, by focusing in on this one problem.

---

The issue starts with an implementation detail: **how Nix solves dependency conflicts.** Nix stores all versions of all packages and dependencies in the Nix Store - a read-only location in your file system for packages - linking them via hashes.

Out of the box, this breaks norms for dynamic linking - where code depends on shared external dependencies by checking some (standardized) file location during startup. Dynamic linking is nice in that it can be efficient, and scary in that it can be fragile. On Nix, it *seems* very fragile - the paths used by the link-loader will all be empty by default, because nix puts all binaries in the Nix store.

But Nix supports dynamic linking - in fact, Nix has its own link-loader. Thanks to this loader, Nix-managed packages with dynamic links work perfectly. They're even more reliable than typical packages, because Nix's links are *versioned*.

To explain why this matters - if a library gets updated, but an older program depends on the older library version, a typical link-loader will try to load the updated library. The older program might then break.

Nix instead remembers the version that was originally linked. It points the program at that old version - still installed, in a separate location - so things continue to work. That's part of Nix's *reproducible systems* promise, and it makes version bumps become much less scary.

Still, there's a flaw here. Traditionally packaged programs don't know about the Nix link-loader. They try to invoke the default OS one instead. That's the one which checks the default OS paths, which Nix doesn't use.

So, someone built a simple fix. It's called nix-ld; in a nutshell, it forwards the non-Nix packages to the Nix link-loader. Enabling it looks like this:

---

```nix
programs.nix-ld.enable = true;
```

With that, typical binaries should work. Easy enough if you know about it, but it's not on by default.

## Five: You can copy others' homework

A heap of clever people have adopted Nix, and you can smooth out many rough edges by adapting their configurations. That's one of Nix's key advantages - it's very easy to download your computer, or to adapt someone else's.

Similarly, LLM's can help you do or understand particular things, if you're judicious. They will repeat complex anti-patterns and sometimes get things wrong, so be cautious, but they're a great help for discovery and comprehension.

<figure style="flex: 1; margin: 0;">
  <img src="/assets/2025-06-29-nix-doesnt-have-to-be-hard/llm_chat.webp" alt="LLM example question" style="width: 100%; height: auto;">
  <figcaption>A fine NixOS starting point from Claude</figcaption>
</figure>


You'll always learn more by building your own things, but learning from others helps you focus on what's valuable to know, keeping you on the happy path. Try to blend both.

Critically, remember:
1) Working systems are more interesting than broken ones, so start small
2) You can't understand everything at once, so pace yourself

## Getting started

For context, my Nix journey started a few months ago. I wanted an answer for search fatigue and Hyprland seemed the best tool. Nix seemed the best way to make a custom desktop environment work, and it was.

While I personally value the knowledge I've picked up along the way, I know most just need a computer that works, and works well. It's with surprise that I've started to think Nix might fill that niche, in time.

If you're interested and want to soften your own adoption curve, you can see my [Nix configuration](https://github.com/dashdotme/nix) and the [related dotfiles](https://github.com/dashdotme/dotfiles) that make it all go.

Those aren't intended as a golden example or a finely polished framework. This is simply what I use and find productive, right now. They're likely to keep changing over time.

## Nix Glossary
Again, to soften the learning curve, here are some approachable definitions for invented terms that come up in Nix discourse.

- **nixpkgs** is the main Nix package repository - it's Nix's equivalent of brew, npm or PyPI
- **Flakes** are an entrypoint file which comes with a lock on the core dependencies. *Use them*.
- **Home Manager** is a completely optional separate scoping for user-level dependencies, which can speed up rebuilds.
- The **Nix Store** holds all your downloaded packages, giving each version of each package a unique hash.
- **Generations** are system snapshots - a set of links to packages in your Nix Store. You can choose your generation (ie. your system version) during boot.
- **Rebuilds** create a new generation for that configuration.
- **Switching** changes your generation on the spot.
- **Dev Shells** are temporary, isolated development environments. They make specific packages available in your shell without installing them system-wide.
- **Packages** are build recipes. They boil down to a download, some tool dependencies, and a bash build script.
- **Modules** are just files - they have inputs (from other nix files) and outputs.
- **Overlays** modify the package set (like nixpkgs). They let you customize existing packages or add new ones to the available package collection.

