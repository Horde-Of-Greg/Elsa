# Policy Around AI Usage

We do not wish to have a complete, strict, no AI policy. But AI can very much make reviewing much harder than it should, and introduce subtle bugs. We very much encourage human-made code, and do not think AI is necessary to write code in any way.

With how rampant AI usage is, we feel it is important to clarify what we think is okay, and what is not. We may, and will reject Issues/PRs on the basis of excessive AI usage.

These lists are non exhaustive. They server as guidance for contributors, not a rigid set of dos and don'ts.

## ✅ What is okay

### Asking AI for advice

Asking AI questions is completely fine, as long as you keep your critical thinking skills and don't blindly accept an answer as truth.

AI can work fine as a search engine, and we do not feel like we should judge which search engine was used. Only the conclusions that come from it.

### Assistance in writing documentation

Writing documentation sucks, and it is one of the things AI is not too bad at. Asking AI to generate some docs is fine, but they should always be thouroughly read and understood. Don't ask `gemini, make the docs for this file` and call it a day.

### Boilerplating

This is one of the least harmful ways to use AI for coding. Boilerplating can never really go wrong, if it did you'll fix it writing the actual code.

### Brainstorming

Ideally, brainstorming should be done with people. But we are not a company with open space offices. Just talking through your implementation ideas with an AI is fine, as long as you're doing the talking and looking for criticism.

What is not, is just asking the AI to throw a full implementation plan at you.

### Reviewing assistance

AI can be useful to filter out the obvious for a review. AI is not reliable enough to be treated as a source of truth for reviews, and should always be handled by a human down the chain.

## ❌ What is not okay

### AI agents

This is probably the worst idea you could have. Unsupervised AI usage with no human thoughts behind the implementations. This is always a **HARD** pass. Do not.

### AI autocomplete

Autocomplete suggestions like Copilot are less harmful than AI agents, and can improve the productivity of _certain_ people. In most cases though, it promotes stagnant code (by only proposing a coding style you already use), and can tend toward agentic-ish usage.

If you use it, and it still looks like your code, we will not mind, but try to avoid it.

### Blind copy pasting

If you're copy pasting a few lines from an AI, this is mostly fine. You will have read through them and it can be similar to copying from a search engine result.

If you're pasting 100 lines of code, or the code is unusually complex, be honest with yourself and accept you don't understand what you're doing. Blindly copy pasting code is the same as agentic AI, except more tedious. Also a hard pass.

### Single source of truth

Many of these concerns can be condensed down to not treating AI as a single source of truth. As long as you understand the AI's reasoning and proposed implementations, we will not mind.

AI should be treated like a cache layer. If you get a quick cache hit, great. But this doesn't mean you won't query the Database if you get a cache miss.
