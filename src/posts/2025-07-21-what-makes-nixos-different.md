---
title: "What Makes NixOS Different (And Why It's Worth Learning)"
date: 2025-07-21
description: "NixOS is unique - and once you're onboard, it's better. From rollbacks to reproducibility and declarative configuration, discover why it's worth the effort."
series: "NixOS"
tags:
  - nix
  - linux
  - development
  - devops
layout: post.liquid
permalink: /what-makes-nixos-different/
---

In the year of the Linux desktop, NixOS still seems a niche distribution, despite its [thriving ecosystem](https://repology.org/repositories/statistics/total). After months of happy use, I get why - its approach is unfamiliar, its mechanics are complex, and the onboarding is very DIY. That's not a recipe for widespread success, but the steady growth among enthusiasts suggests something else: *once you're onboard, NixOS is better*.

To help with the onboarding problem, I thought I'd explain why Nix and NixOS are clever tech, from the ground up. This should give you a better idea of what it is, how it helps and whether adopting might be worthwhile for you.

We'll start with fundamentals - what Linux distributions are - then, we'll explore the unique choices that make NixOS increasingly appealing (and my pick for the foundation of a future consumer-grade Linux distribution).

In a later post, I'll cover installation, along with getting started with NixOS. My goal there is a straightforward, start-to-finish guide for a new user transitioning an existing machine. That should supplement the detailed [official installation guide](https://nixos.org/manual/nixos/stable/#ch-installation), which goes a bit beyond what new users need.

---

## What is NixOS?
And what does it mean to be a **Linux distribution**? To begin with, let's get a layman's definition for an **operating system**: it is *your means of interacting with your machine*.

The most critical part of this is the **kernel** - the component that orchestrates all interactions between your hardware, from the mouse to your filesystem to the CPU. Programs interact with this hardware through **system calls**, which the kernel manages; the kernel uses **device drivers** to communicate to specific devices. This is why software and hardware compatibility varies.

A **Linux distribution** is an operating system which uses the **Linux kernel** first released by Linus Torvalds in 1991. Linux accelerated and popularized the movement for **free and open-source software**; because of its efficiency, ease of customization and permissive license, it has become the de facto standard for servers and tech enthusiasts.

Distributions vary widely in how they are composed, but common pieces include a **package manager** (for downloading compatible software), a **bootloader** (for launching the kernel, which then manages everything else), a **display server** or **compositor** (for drawing to your screens) and a **shell** (for passing commands to the machine).

By making different default choices and orchestrating their package managers in different ways, different distributions create very different *flavours of Linux*. Some are easy to adopt (Ubuntu, PopOS); some are deeply customizable (Arch); some offer long-term stability (Debian), or stronger enterprise security (RHEL). This variety is key to the success of Linux.

**NixOS** exemplifies this variety, as a unique and deeply customizable distribution. It exists to marry the Linux kernel with the **Nix** package manager. It makes very few choices beyond that - you can customize your bootloader, display server, desktop environment, shell or utilities to your heart's content. However, by pairing with **Nix**, **NixOS** creates a new and unique desktop experience, because **Nix changes the rules**.

The first rule Nix changes is how packages are installed. Linux distributions generally follow [the FHS, a Unix standard for the filesystem layout](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard). Nix breaks this convention, downloading all packages to the **Nix Store** - a read-only location in your file system, where every built package is **isolated** and given a **unique hash**. This allows **multiple versions of the same package** to be stored and referenced, enhancing **reproducibility** and **resolving dependency conflicts**.

The second rule Nix changes is how packages are managed. Nix is a **declarative** package manager; NixOS extends this to **define your whole OS succinctly, line-by-line, as declarative configuration**. This happens not through quickly-forgotten terminal lines or scripts, but in *.nix* config files written in the *Nix* functional programming language.

This means that all configuration is **centralized and explicit**. System files are **immutable** - users can only edit their configurations, simplifying updates. Updates themselves are **atomic**, creating new **generations** - a set of links to (hashed) packages in the Nix Store. This allows **changing configurations back and forth, on the fly**.

{% note %}
**Example**: My machine has a few node versions, from dependencies. They're stored as:

`/nix/store/c8jxsih8yy2rnncdmx2hyraizf689nvp-nodejs-22.14.0`
and
`/nix/store/4qx33yfkway214mhlgq3ph4gnfdp32ah-nodejs-20.19.2`.

The hash is calculated by the build recipe, called a *derivation*. Generations link to exact package versions using this hash. [The details get complicated, but you can start here.](https://nix.dev/manual/nix/2.28/store/store-path.html)
{% endnote %}

## What You Get

### 1. An 'Unbreakable' Operating System
**NixOS** allows you to choose your generation via the bootloader during boot. If anything goes wrong, you can **always load your last working version**.

This is the feature that got me on board with Nix. My most painful low with Linux came after trying an in-place version upgrade on Ubuntu, right as my partner and I were organizing a move overseas.

The OS broke; a start-up dependency needed a different version of OpenSSL. As half our things were packed, and I was starting the job hunt on top of work, I didn't have time to burn fixing it.

My fallback environments were an old Windows install, and a laptop with hardware issues. Cue a few stressful job interviews, and more than one mid-exam freeze as I did certifications.

By converting all my machines to NixOS later, I traded time for **peace of mind**. The more lightweight OS also made my laptop hardware usable again.

### 2. A Reusable System
Another source of security is NixOS's **reproducibility**. The declarative configuration lets you literally *download your PC*, with minimal tweaking required for a different machine; meanwhile, the hashing system (combined with *flakes as lock files*) ensures the two sets of software are **identical**.

There are limitations here - different hardware might require different dependencies or build targets, which creates a build process with a different hash. These details *generally* aren't the user's problem, and Nix handles the differences elegantly, without hiding the information if you go searching for it.

That creates a very cool experience - time tinkering on my laptop carries over to my desktop, or to the next laptop. I'm defining *my flavour of Linux*, not just configuring a host.

A key aspect of this is how easy it is to make other machines run your variant of Nix. Once you know the process, installs can be done in half an hour. You might still need to tweak for hardware differences, but the core desktop experience *just works*; it feels like magic. And now, all your machines can work the *exact same way* - *the way you like*.

One last big win here is that you can easily try out others' configurations, or read and adapt their good ideas. You can even build your configuration directly from someone else's Github repo.

{% note %}
**Aside:** There's room for something clever here in the future - a configuration marketplace showcasing different pre-built desktops, with commands to try them out.

{% endnote %}

### 3. An Escape from Dependency Hell
Nix's versioned dependencies are the solution to a common problem with software: sometimes two packages depend on **different versions** of the same thing. This can cause things to break. [I covered the implementation details for this in a previous post](https://dashdot.me/nix-doesnt-have-to-be-hard), but the key point is that **Nix takes care of this for you**. It's part of the *reproducibility* promise.

I hit one situation where it seemed like this promise hadn't held true. On one machine, Spotify wasn't launching; on another, it was. They had the exact same configurations, with the same hashes on relevant packages.

An hour later, after a deep dive into Nix implementation details, I realized Spotify had a broken file in its cache on the 'broken' machine. After deleting the cache folder, everything worked.

That showed me something important: **Nix is complex - but it works.** The promises hold true, and they reliably solve problems. If you're deeply technical, that's valuable.

The big win for this point is that **updating your core system dependencies on NixOS is easier. Things break less. At worst, you can roll back (without restoring from a backup).** If you're managing a lot of machines, that's a big deal.

### 4. A Self-Documenting System
This point is built on a double-edged sword: NixOS requires writing your configuration in the Nix language. Like other declarative languages, Nix is great at expressing high-level decisions in a concise, readable way. The downside is that more complex flows can get messy.

The key gain from declarative code is that, however you approach it, the core of your system will be explicit, compact and centralized. This makes it much easier to solve issues, as you can see exactly what you (or someone else) did, without getting lost in files from the OS.

With modern NixOS, using *flakes* as lock files, you can also be sure that version control is in use. Files which aren't tracked in git are omitted from flakes. Used well, version control makes it easy to map problems to specific changes.

While the underlying realities here are complex, Nix's high-level approach **keeps maintenance simple**. Though this comes with one last downside: **Nix has some of the most cryptic error messages you'll ever see**.

### 5. Lean Systems, Ephemeral Environments
NixOS's complete customizability means that it's very easy to craft your own *minimal distribution*. That means fast boots, and minimal system resources used when idle.

This pairs well with a cross-platform feature from Nix: temporary environments via `nix develop` or `nix shell`. `nix develop` is the biggest innovation here: all project-specific dependencies can be detailed in a nix configuration, which anyone can then access via a command. When you exit that shell, those dependencies vanish - still cached, but inactive.

That's a lot simpler than the alternatives: lengthy READMEs, complex Docker setups which make local development harder. And it's zero-overhead: you're activating natively installed packages, running local processes. You can have a Rust environment here, a Zig environment there, and a few different Python or Node environments - all without conflicts or extra tools.

More than that, Nix's reproducibility means that *the environment just works*. No more troubleshooting a coworker's machine; no more confusion because it "works on my machine".

### 6. Bleeding Edge Software
This streamlined development workflow is well supported by Nix's extensive package library. Like Arch Linux, Nix focuses on providing an enormous and current package repository via `nixpkgs`. While it's often not quite as current as Arch, it is more accepting, with more packages available overall.

This is driven in part by the difficulty of using non-Nix packages with NixOS. For the people who know how, packaging is the easiest way forward. Sharing these packages when you're done, on `nixpkgs`, is relatively easy.

That stems from a relatively accepting community, guided by trust in the stability of the architecture. While the package review process puts productivity before security, it's allowed an ambitious project to be maintained by a relatively small community, letting Nix slowly grow over time.

This productivity has also now spread to MacOS packages via `nix-darwin` - allowing a much larger community to benefit from Nix innovations like the dev shell.

### 7. Network Effects
Because NixOS is a very easy place to build great custom desktop environments, the community surrounding the distribution will help guide you toward **great software** and **clever engineering practices**. From showcases of lovingly crafted setups to complex stacks that do interesting scripted virtualization - you will learn things.

If you're a software professional, that includes useful and transferable knowledge - from navigating functional/declarative code, to managing and documenting machines, to learning about the productive ideas that are being used in open source.
