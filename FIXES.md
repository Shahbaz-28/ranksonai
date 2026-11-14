# How We Actually Fix Things

Plain English. No jargon. For anyone asking: *"We only tell people what's wrong — so how do we fix it?"*

---

## 1. The question

Visilm finds out why AI engines don't recommend your business.

Fine. But finding the problem is not the same as solving it.

> If we only hand someone a list of problems, why would they keep paying?

This file answers that: **what we can fix, what we can't, and what access we need.**

---

## 2. Think of it like a house

Your customer's website is their house.

| What we do | Do we need a key? |
|---|---|
| Stand on the street and look at it | **No.** Anyone can look |
| Change something inside | **Yes.** Some kind of key |

**Looking needs no permission.** We read their website the same way Google does. That's why the free scan works on any domain — they just type it in. No login, no setup, no waiting.

**Changing needs permission.** That's what the rest of this file is about.

---

## 3. The bit most people miss

Not every fix is in their house.

Here is a real result. We asked ChatGPT *"best accounts payable software for mid-market companies"* and it quoted four sources:

```
g2.com          ← not our customer's website
capterra.com    ← not our customer's website
paylineops.com  ← a competitor's website
cfodive.com     ← an industry news site
```

**Three of the four had nothing to do with our customer.**

That is normal. AI engines mostly quote *other people talking about you*, not your own marketing pages.

So fixes come in two buckets:

| Bucket | Where it lives | Can we get in? |
|---|---|---|
| **On-site** | Their own website | Yes — several ways |
| **Off-site** | G2, Capterra, Reddit, "top 10" articles | **Never.** Not our house — and not theirs either |

Getting website access only solves the first bucket. Worth knowing before we build anything.

---

## 4. On-site: four ways in

Simplest first.

### Way A — We write it, they paste it

**Key needed: none**

We don't say *"you should add a pricing page."* That is advice, and advice is free on the internet.

We hand them the **finished thing**:

- the complete pricing page, written out, ready to publish
- the FAQ section, written out
- the technical markup, ready to copy

They paste it into their website themselves.

> *Like posting someone flat-pack furniture with the instructions. They still have to build it.*

- **Good:** works for every customer on day one. Nothing to integrate.
- **Bad:** about half never get around to it. That is where we lose customers.
- **Verdict: build this first.** This is the difference between "nice to know" and "worth paying for".

---

### Way B — We open a pull request

**Key needed: a GitHub app, locked to one project**

Most B2B software companies keep their website as code, in GitHub. Their developers already have a routine: someone proposes a change, someone else reviews it, then it goes live.

We simply join that routine. We propose the change in the format their team already uses, and a human reviews and approves it.

> *Like handing finished plans to their builder. The builder checks them, then does the work.*

- **Good:** fits how they already work.
- **Good:** easy security conversation — we can only suggest, never push anything live.
- **Good:** we get a record of who approved what, for free.
- **Verdict: build this second.** Our customers are B2B software companies, and this is exactly how their websites are run.

---

### Way C — We connect to their website builder

**Key needed: they click "allow" once, like signing in with Google**

For customers on WordPress, Webflow, Shopify and similar. We create the page as a **draft**. It sits there, unpublished, until they press the button.

> *Like having a key to the workshop. We leave the finished furniture in the hallway. They decide whether it goes in the room.*

- **Good:** covers everyone who isn't technical — which is most of the market.
- **Bad:** every website builder works differently, so it is a lot of separate work.
- **Verdict: build this later,** when customers start asking for it.

---

### Way D — We inject changes live

**Key needed: deep access to their live website**

We could sit in front of their website and change pages as visitors load them.

> *Like moving into their house and rearranging the furniture while guests are walking through.*

**Don't do this.** Two reasons:

1. **If we go down, their website goes down.** Their homepage would depend on our servers. One bad night and we have broken a customer's business.
2. **It probably doesn't even work.** Many AI crawlers don't run JavaScript. We would be making changes the AI engines never see — all of the risk, none of the benefit.

- **Verdict: never build this.**

---

## 5. The rule that makes all of this possible

> ## We never publish. We only propose.

Every method above ends with **a human pressing the button.** We create drafts. We open suggestions. We do not push things live.

This is not caution for its own sake. It decides whether we get access at all:

| What we ask | What they say |
|---|---|
| "Give us permission to change your website" | Security review. Weeks. Usually no. |
| "We write it, your team approves it" | Yes. |

The same technical access — a completely different answer. And it is already what we promise on our own website: *"Nothing published without approval."*

---

## 6. Off-site: the honest part

We cannot post a review on G2. We cannot edit someone's "Top 10 Tools" article. Those are not our customer's property and never will be.

But we are far from useless here.

**1. We find the opportunities**

> *"ChatGPT quotes these 6 articles when people ask about your category. You appear in 1 of them. Here are the other 5, who wrote them, and how to get in touch."*

Nobody else can tell them that. It is genuinely valuable on its own.

**2. We write the outreach for them**

The email asking a happy customer for a review. The pitch to the journalist who wrote the article. The checklist for filling out a G2 profile properly.

**3. We do it for them — as a service, not software**

Real people doing real outreach. A separate, expensive offering (think $2,000–5,000 per month). That is an agency, not a product.

**Worth knowing:** option 3 is where most of the money in this industry sits today. Our software is the perfect way to find customers for it, because we are the ones who can *prove* they have the problem.

---

## 7. The order we build in

| # | What | Why now |
|---|---|---|
| 1 | **Way A** — write the finished content | Works for everyone, needs no integration |
| 2 | **Way B** — GitHub pull requests | Matches exactly how our customers' websites work |
| 3 | **Off-site finder** — spot and rank the opportunities | Needs no access, and it is the bucket that matters most |
| 4 | **Way C** — website builder connections | Only when customers ask |
| 5 | ~~Way D~~ — live injection | Never |

---

## 8. The real problem — and it isn't technical

Here is the thing that will actually slow us down:

> **The person who buys Visilm usually cannot change the website.**

Marketing buys it. Engineering or IT controls the site. So marketing receives a beautiful list of fixes, then has to go and ask another department for a favour.

That is not a software problem. It is an organisational one, and it is bigger than any integration we could build.

**Way B is our best answer to it.** A pull request is the format engineering already accepts work in. Instead of marketing asking for a favour, they forward something ready to review. It turns an awkward request into a normal piece of work.

---

## 9. The shortest version

```
Looking at their site          →  needs no permission at all
Writing the fix for them       →  needs no permission either
Putting the fix on their site  →  needs permission, and a human always approves
Fixing G2 / Reddit / articles  →  impossible for software
                                  we find them, humans do them
```

**We don't sell a list of problems. We sell the finished fix, delivered in a form their team can approve in one click — and then we prove whether it worked.**

---

See also: `EXPLAINER.md` (what the product does), `PLAN.md` (architecture and decisions), `ROADMAP.md` (build order).
