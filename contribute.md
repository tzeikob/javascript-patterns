# Contributions

You are welcome to contribute to the quality of this content by submitting PR's for additions, fixes and improvements to code snippets, explanations, etc. In case you are not sure or there is any confusion about a phrase, term or definition used, **before submitting a PR, open an issue to ask about it**.

> NOTE: With your contribution (not just minor typos) to this content, you agree to giving me the right to non-exclusive license and use that content for any future commercial use, like print books.

## Search before submit

In case you have any questions about the content or a code snippet, please make sure to check in [issues](https://github.com/tzeikob/javascript-patterns/issues) page first, there are great chances others in the community having the same concerns. This way we can keep the churn of issues to a minimum.

## Add a new Design Pattern

In order to keep the content of the book well organized and as uniform as possible every design pattern should be given as a `readme.md` file placed under a parent folder which is expected to be the category the pattern belongs to. The content of this file must be written in a specific structure of four main sections, the introduction, the implementation, the considerations and the use cases. Both the considerations and the use cases sections are optional and so if not applicable can be skipped. Below you can find an abstract example of such a readme file.

```markdown
# The <Name> Pattern

A short introduction about the pattern...

## Implementation

### Sub-section in short phrase

Paragraphs of free text followed by code snippets...

### Sub-section in short phrase

...

## Considerations

### Consideration in short phrase

Paragraphs in free text followed by code snippets...

### Consideration in short phrase

...

## Use Cases

Below you can find various trivial or real-world implementations of this pattern:

 * [<Name>](<filename>.js): A single line description about the implementation
 * ...
```

In the introduction section must be provided an overall information about the pattern, for instance which category belongs to, a high level overview of how the pattern works, conditions and limitations under which the pattern should work and so on. This section must be maximum 1-2 short paragraphs long.

The implementation section is where we must describe how to implement the pattern using free text along with code snippets. The key point here is to be brief and concise as much as possible, we don't want to bloat the reader with to much information. Trying to explain everything not related to the pattern is not a good thing. A good practice is to use sub-sections to organize different parts of the implementation keeping paragraphs as small as possible. Do not forget that you can use inline comments in the code snippets to be used as complement to your text. When referring from a paragraph to a specific variable in the code snippet, emphasize it via markdown single ticks, for instance a reference to a variable called index should be given as `index` and only at the first occurrence in each paragraph.

The considerations is an optional section where you can add content explaining additional information about the pattern which must be known. For instance, various second thoughts about the pattern, anti-patterns we have to avoid, limitations about resources and precautions and so on.

The use cases section is where you can add trivial or real-world implementations of the pattern. Every implementation file should be given as a JavaScript file in the same folder the `readme.md` file of the pattern exists. Each file should have a name with all characters in lowercase and words separated by hyphens, like `parallel-reducer.js`.

Overall try to not describe everything to the reader, for instance may be not the right place to explain the internals of the Promise reading about the parallel execution pattern. Is expected that the reader has a good background of JavaScript in order to read about design patterns so don't explain everything to him.

## Fix typos

In case you are about to submit a PR for typo fixes, please consider in doing this by collecting several typos into a single PR with separate commits.

## Work in progress

The current edition of this content is pushed in the default branch and must considered as a work **in progress**. While this content is in progress, contributions are welcome, but it's impossible to turn back in 1st edition while I'm still working on this current version.

Please note that I **am not accepting any contributions** for 1st edition any more.

## Pull request guidelines

### Use short and specific as possible titles

The title of every PR should be a short phrase pointing to what this PR is all about, where the first character should always be in uppercase and the rest in lowercase. In case the PR is related to a specific reported issue (e.g. fix, feature, etc.) include its number in the form `(#issue-number)` at the end of the title.

> Please do not use periods, special characters or emoticons in the title, titles like `Fix! => typo.` will not be accepted.

A good example of a title is, `Add a new impl to the parallel execution pattern (#13)`.

### Use the description to provide a more in depth information

Every PR should have a description starting with some line of information in the following form.

```
Category: Behavioral
Pattern: Observer
Label: Fix
Issue: #13

Add free text here...
```

Where `Category` and `Pattern` must referring to the category and the name of the design pattern which this PR is fixing, adding, modifying, etc. The `Label` should be a single keyword indicating the purpose of this contribution, for instance adding a new pattern the label is expected to be given as `Feature` (see github issues labels). Last but not least the `Issue` line, which is optional and required only if this PR is attached to a specific issue created in the issues page.

After adding the previous information you can use more lines in free text to describe what this PR is for and provide as much context as possible including perhaps code snippets and links.