---
title: "5 Quick Tips for Terraform"
date: 2025-08-04
description: "Some practical advice for using IaC productively at smaller scales."
tags:
  - devops
  - IaC
  - terraform
  - declarative
layout: post.liquid
permalink: /5-quick-tips-for-terraform/
---

In my experience, IaC can be a bit contentious, especially for new adopters who struggle to see why it's worth the time. There's something to it though - once you learn, it's hard to go back, and there's a point where standardized infrastructure is essential. As Terraform is still my tool of choice, I thought I'd quickly break down the practices I find most key to productivity.

## 1. Right-Size Your Architecture
Word of warning: if you seek tools, templates and guides for IaC, you'll mostly find tools and advice geared toward large enterprises. The upside is that these serve as a standard; the downside is, they're often overkill.

A better approach is to figure out your own needs. Start as small as you can, keeping things organized with logical boundaries. That means separating files or deployments by concern, and isolating tenants and environments via .tfvars files and separated backends. For example, here's a generic environment:

```bash
.
├── backends
│   ├── prod.tfbackend
│   └── qa.tfbackend
├── locals.tf
├── main.tf
├── main_compute.tf
├── main_databases.tf
├── main_monitoring.tf
├── main_networking.tf
├── main_rbac.tf
├── README.md
├── root.tf
├── settings.auto.tfvars
├── tfvars
│   ├── prod.tfvars
│   └── qa.tfvars
└── variables.tf
```

Core resource files get the main prefix, separated by concern. These may become your module boundaries later.

The backends/ and tfvars/ folders hold per-environment variables. Switch & plan on different environments with:

```bash
terraform init -backend-config=backends/qa.tfbackend
terraform plan -var-file=tfvars/qa.tfvars
```

This approach stops you from burning time on abstractions early. While tools like modules are great, plumbing for module boundaries takes time - both to set up and to understand. There are cases where it will save you, but if you don't know what's needed, do it later. Focus on the fundamentals - clearly mapping resources and relationships - first.

## 2. Importing State is Easy
This is a two step process - add your import block:

```terraform
import {
  to = aws_instance.example
  id = "i-1234567890abcdef0"
}
```

Ask Terraform to generate the configuration for that resource in a new file:
```bash
terraform plan -generate-config-out=new-generated-resource.tf
```

The resulting resource will include a lot of noisy defaults, which you will want to tidy, but it's a lot easier than building the current resource configuration by hand.

## 3. Favour Variables Over String Duplication
Terraform has a few different names for variables at different scopes - mainly `locals` and `vars`, and then `tfvars`. You can frame these as constants/computed values (locals) or plumb-able inputs (vars). Tfvars are your per-deployment overrides; you'll commonly see them in a `tfvars` folder, named for the environment.

Converting between scopes is very easy, while converting from repeated strings to a local or variable can take effort. For that reason, it's worth defining a few conventions (like naming) up front, and using locals across those conventions. For example,

```terraform
resource "azurerm_resource_group" "rg" {
	# eg. company-test-aueast-app1-rg
	name = join("-", [local.company, local.environment, local.region, local.deployment, "rg"])
	location = var.location
}
```
To minimize the indirection here, I leave comments.

If you're in a large corporate environment, you might see these conventions enforced via per-resource modules, making things even more abstract.

## 4. Provisioners Are Sometimes Helpful
While they are best avoided, Terraform [provisioners](https://developer.hashicorp.com/terraform/language/resources/provisioners/syntax) let you work around specific cloud limitations. A good example is that Azure Key Vault references in Terraform expose secrets in the tfstate. You can get around this by using something else (like AWS, or a tool like Sops) for secrets management, or by keeping this logic outside of Terraform.

If you're automating deployments for an older application which relies on password logins, this means an extra step. If you script that step, you can make a Terraform provisioner run it after it creates the resource, keeping your system cleanly automated.

Do note that this is no replacement for tools like Ansible. Provisioners add complexity, aren't necessarily idempotent, and can taint resources for recreation when it isn't necessary.

There are good reasons to simply avoid the practice here - but it can save you some time if you're judicious.

## 5. Try Not To Be Clever
This is a general one for infrastructure - keep it simple. Evolving business needs usually end up adding enough complexity.

In part, this is where Terraform shines - it represents simple relationships well, while complicated ideas become hard to express.

If you're fighting it, it's often worth taking a step back and asking if your problem can be solved elsewhere.

**Note**: that doesn't mean copy and pasting everything everywhere... that becomes it's own headache quickly.
