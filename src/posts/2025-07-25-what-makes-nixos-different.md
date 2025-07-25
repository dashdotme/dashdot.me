---
title: "What Makes NixOS Different (And Why It's Worth It)"
date: 2025-07-25
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

## The Story That Led Me To NixOS
Like many kiwis at the time, my partner and I were preparing for a shift overseas. She was finishing her master's and had just accepted a job offer; I was preparing for certifications, juggling work and the move admin, about to start my own job hunt. As I was studying, a notification popped up; for some reason, that seemed the perfect time to try updating Ubuntu on my home machine.

I knew it was dangerous; I thought a few packages might break, and my third-party repositories would stop working. Instead, my screen filled with errors, and the install was bricked. Either OpenSSL hadn't installed correctly, or some part of the system boot was depending on an older version. Whatever the cause, it was a bigger mystery than I had time for.

My fallback environments were an old Windows install and a laptop with hardware issues. The first freeze during an exam I dealt with; by the second, I was on edge. Cue a few nervous digital interviews - I was keen to keep them short.

In the end, it all worked out. And when I sat down to fix my home desktop a few months later, reinstalling Ubuntu was an easy enough fix. That just wasn't how I wanted to spend my time regularly - I wanted to freely tinker, and NixOS was my answer.

---

## Overview
In *the year of the Linux desktop*, NixOS still seems a niche distribution, despite its [thriving ecosystem](https://repology.org/repositories/statistics/total). And I get why - its approach is unfamiliar, its mechanics are complex, and the onboarding is very DIY. That's not a recipe for widespread success, but the steady growth among enthusiasts suggests something else: *once you're onboard, NixOS is better*.

To help with the onboarding problem, I thought I'd explain why Nix and NixOS are clever tech, from the ground up. This should give you a better idea of what it is, how it helps and whether adopting might be worthwhile for you.

We'll start with fundamentals - some simple definitions. Then, we'll explore the unique choices that make NixOS increasingly appealing (and my pick for the foundation of a future consumer-grade Linux distribution).

{% note "short" %}

I've wrapped the basics in dividers, so you can skip ahead if you know your stuff.

{% endnote %}

In a later post, I'll cover installation, as well as *getting started with NixOS*. My goal there is a straightforward, start-to-finish guide for a new user transitioning an existing machine. That should supplement the detailed [official installation guide](https://nixos.org/manual/nixos/stable/#ch-installation), which goes a bit beyond what new users need.

---

## What is NixOS?
And what does it mean to be a **Linux distribution**? To begin with, let's get a layman's definition for an **operating system**: it is *your means of interacting with your machine*.

The most critical part of this is the **kernel** - the component that orchestrates all interactions between your hardware, from the mouse to your filesystem to the CPU. Programs interact with this hardware through **system calls**, which the kernel manages; the kernel uses **device drivers** to communicate to specific devices. This is why software and hardware compatibility varies.

A **Linux distribution** is an operating system which uses the **Linux kernel** first released by Linus Torvalds in 1991. Linux accelerated and popularized the movement for **free and open-source software**; because of its efficiency, ease of customization and permissive license, it has become the de facto standard for servers and tech enthusiasts.

Distributions vary widely in how they are composed, but common pieces include a **package manager** (for downloading compatible software), a **bootloader** (for launching the kernel, which then manages everything else), a **display server** or **compositor** (for drawing to your screens) and a **shell** (for passing commands to the machine).

<figure style="flex: 1; margin: 0;">
  <img src="/2025-07-25-what-makes-nixos-different/shell_in_shell.png" alt="A shell depicted in a shell" style="width: 100%; height: auto;">
  <figcaption>A shell inside a shell.</figcaption>
</figure>

By making different default choices and orchestrating their package managers in different ways, different distributions create very different *flavours of Linux*. Some are easy to adopt (Ubuntu, PopOS); some are deeply customizable (Arch); some offer long-term stability (Debian), or stronger enterprise security (RHEL). This variety is key to the success of Linux.

---

**NixOS** exemplifies this variety, as a unique and deeply customizable distribution. It exists to marry the Linux kernel with the **Nix** package manager. It makes very few choices beyond that - you can customize your bootloader, display server, desktop environment, shell or utilities to your heart's content. However, by pairing with **Nix**, **NixOS** creates a new and unique desktop experience, because **Nix changes the rules**.

The first rule Nix changes is how packages are installed. Linux distributions generally follow [the FHS, a Unix standard for the filesystem layout](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard). Nix breaks this convention, downloading all packages to the **Nix Store** - a read-only location in your file system, where every built package is **isolated** and given a **unique hash**. This hash, calculated based on the *build inputs* (termed [*derivations*](https://nix.dev/manual/nix/2.28/store/derivation/)), allows **multiple versions of the same package** to be stored and referenced. The result looks something like:

```nix
/nix/store/c8jxsih8yy2rnncdmx2hyraizf689nvp-nodejs-22.14.0
/nix/store/4qx33yfkway214mhlgq3ph4gnfdp32ah-nodejs-20.19.2
```

The second rule Nix changes is how packages are managed. Nix is a **declarative** package manager; NixOS extends this to **define your whole OS succinctly, line-by-line, as declarative configuration**. This happens not through quickly-forgotten terminal lines or scripts, but in *.nix* config files written in the *Nix* functional programming language.

{% note %}
**Example:** setting up Firefox, SSH and Docker.

```nix
programs.firefox.enable = true;
services.openssh.enable = true;
virtualization.docker.enable = true;
virtualization.docker.enableOnBoot = true;
```
{% endnote %}

This means that all configuration is **centralized and explicit**. System files are **immutable** - users can only edit their configurations, which simplifies updates. Each update creates a new generation (a set of links to hashed packages), making changes atomic. This allows **switching between configurations**. Since every reference is versioned by its inputs, **what worked yesterday will work tomorrow** - guaranteeing **reproducibility**.

## What You Get

### 1. An Unbreakable, Reusable System
**NixOS** allows you to choose your generation via the bootloader during boot. If anything goes wrong, you can **always load your last working version**.This unbreakable nature, combined with the **reproducibility** of Nix means you can literally download your PC, with minimal tweaking required for different machines.

This is what sold me. By converting all my machines to NixOS, I traded time for **peace of mind** and a **portable environment**. My laptop *feels the same* as my desktop; time spent tinkering on one carries over to the other. I'm *defining my flavour of Linux*, not just configuring a host.

While you may still need to tweak for different hardware, the core desktop experience *just works*. And once you know the process, fresh installs can be done in half an hour - *for everything*.

You can also easily try out others' configurations, adapt their ideas, or even build directly from someone else's GitHub repo. It's a great way to learn.

### 2. An Escape from Dependency Hell
Nix's versioned dependencies are the solution to a common problem with software: sometimes two packages depend on **different versions** of the same thing. This can cause things to break. [I covered the implementation details for this in a previous post](https://dashdot.me/nix-doesnt-have-to-be-hard), but the key point is that **Nix takes care of this for you**. That's part of the *reproducibility* promise.

{% note %}

I hit one situation where I thought Nix's reproducibility had failed. On one machine, Spotify wasn't launching; on another, it was. They had the exact same configurations, with the same hashes on relevant packages.

An hour later, after a deep dive into Nix, I realized the 'broken' machine had a bad file in Spotify's cache. I deleted it; Spotify worked.

There's a point here. The complexity adds overhead, but it works.

{% endnote %}

This means that **updating your core dependencies on NixOS is safer**. It's not just that you have rollbacks - *things break less*.

If you're managing a lot of machines, that's a big deal. And even if you're not - it's nice having access to the latest things.

### 3. A Self-Documenting System
This point is built on a double-edged sword: NixOS requires writing your configuration in the Nix language.

Like other declarative languages, Nix is great at expressing high-level decisions in a concise, readable way. The downside is that more complex flows can get messy.

The key gain from declarative code is that, however you approach it, the core of your system will be explicit. By keeping things compact and centralized, you also get something that is easy to maintain. However you approach it, Nix separates *your work* from *OS boilerplate*; this means you can quickly see exactly what you (or someone else) did to cause an issue.

With modern NixOS, using *flakes* as lock files, you can also be sure that version control is in use, as untracked files are ignored by the flake. This *should* simplify debugging, even if you're working across machines.

Note this all comes with one big downside - Nix can generate some *pretty cryptic* error messages. They're improving, but for niche cases (like packaging missing a dependency), they can lead you astray.

<figure style="flex: 1; margin: 0;">
  <img src="/2025-07-25-what-makes-nixos-different/nixos_errors.png" alt="Comfy Mode" style="width: 100%; height: auto;">
  <figcaption>Nix letting me know I've typed "true" instead of true somewhere.</figcaption>
</figure>

### 4. Effortless Development Environments
One of Nix's most powerful features works across all platforms, not just NixOS. It comes in two flavours: `nix shell` and `nix develop`.

`nix shell` lets you temporarily install packages - great for one-offs or quickly trying things out.

`nix develop` loads an entirely isolated environment, with exactly the tools and dependencies you need. It's verbose, but a minimal example looks like:
```nix

{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      packages = with nixpkgs.legacyPackages.x86_64-linux; [
        go
        golangci-lint
        nodejs_20
      ];
    };
  };
}
```

With this in your project root, you can run `nix develop` anywhere in your project to get a shell with Go, linting and Node v20. When you're done, it just disappears.

While the underlying machinery is complex, the user experience here is simply brilliant. No lengthy setup docs, no conflicts between projects, no overhead from a local Docker setup. *It just works*.

<figure style="flex: 1; margin: 0;"> <img src="/2025-07-25-what-makes-nixos-different/different_shell.png" alt="A different shell depicted in a different (ephemeral) shell." style="width: 100%; height: auto;">
  <figcaption>A different shell in a different shell. Art packages temporarily installed with nix shell.</figcaption>
</figure>

### 5. Lean Systems, Bleeding Edge Software
This point piggybacks on the last. Because NixOS is completely customizable, and because Nix simplifies ephemeral environments, it's easy to live with a minimal system. That means fast boots, minimal resource usage when idle, and simpler maintenance.

This streamlined development workflow is well supported by [Nix's package library, `nixpkgs`](https://search.nixos.org/packages). It rivals even Arch Linux's AUR for breadth, and comes close for freshness, with over 120,000 packages available today.

While this productivity is partly driven by challenges with using non-Nix packages on NixOS, the core user experience is great. Nearly everything you can think of is available; you can even search for packages by command.

{% note %}
**Example**: Looking up and using a package. I've aliased the lookup to `wat`.

```
/home/dash/projects/dashdotme [dash@xps] [21:30] [0]
> wat uv
'uv' is already installed at: /etc/profiles/per-user/dash/bin/uv

/home/dash/projects/dashdotme [dash@xps] [21:30] [0]
> wat poetry
The program 'poetry' is available in:
  poetry.out

/home/dash/projects/dashdotme [dash@xps] [21:30] [0]
> nix shell nixpkgs#poetry

/home/dash/projects/dashdotme [dash@xps] [21:31] [0]
> poetry
Poetry (version 2.1.3)
...
Available commands:
  about              Shows information about Poetry.
  add                Adds a new dependency to pyproject.toml and installs it.
...
<rest omitted for brevity>
```

There are two underlying approaches here - `nix-locate` or `nix search`. I'm using `nix-locate`.

{% endnote %}

Critically, you're free to try the latest and greatest on Linux, without any worry of breaking your machine.

It's not all sunshine and rainbows, though: Nix's approach can create security maintenance challenges{% fnref 1 %}. These problems get harder because `nixpkgs` is so big.

### 6. Learning, and Network Effects
There's a simple way to frame this: the people that deal with complexity for fun are unusually clever. It's very easy to learn from them.

Specific things you might learn about include productivity tools, desktop environments, security practices, development approaches, virtualization techniques, and Linux/packaging details.

You don't need to go all the way down the rabbit hole, but if you're a software professional, the learning opportunities run deep and transfer well.

## Closing
Let's be straight - NixOS asks a lot of you. Mainly, it asks you to think different, and *different is hard*.

Different done well gradually simplifies things, though. And with the right abstraction, a great many problems can be solved all at once.

For me, that's the space NixOS occupies. It solves hard problems - problems that other distributions expect you to live with or work around. It's the distribution saying worse doesn't always *have* to be better; you don't have to maintain setup scripts, and you don't need that ISO waiting on a USB. It's 2025 - you can have a stable Linux desktop *and* be on the cutting edge.

There's no arguing about the complexity, though. So maybe there's room to improve and simplify Nix; maybe some offshoot like [Guix](https://guix.gnu.org/) or [Lix](https://lix.systems/) will gradually take over. Or maybe NixOS will just continue to quietly improve - few mind when something robust is complex under the hood.

I'll tell you a secret though: wherever things go next, Nix users will be happy. They've already climbed the mountain. They're now quietly enjoying a better desktop experience, searching for the next clever idea. They've got a good view.

{% footnotes %}

{% footnote 1, "Security Challenges" %}

One problem with Nix's approach to packaging comes from **vendored dependencies** - the practice of shipping your own copy of the source code for a dependency, rather than relying on external package registries. This is a common approach for security and reliability, used by companies to prevent supply chain attacks and guarantee reproducible builds.

The problem is, when security vulnerabilities are discovered in vendored code, they need to be patched in multiple places: this means updating the original dependency, as well as every package that copied it.

This creates two challenges for Nix: maintainers need to ship the core dependency patch quickly, but they also need to identify and fix **every version** of every package that vendored the vulnerable code. There's no automated solution for tracking these vendored dependencies, making this a manual and error-prone process.

Add in the volunteer-driven nature of the Nix community, and the sheer size of the repository, and you have a very hard problem.

If you're looking for distributions with solutions to this problem, consider RHEL or Ubuntu. Otherwise, bump your flake locks regularly, to reduce the risk of being on vulnerable versions.

{% endfootnote 1 %}

{% endfootnotes %}
