# Contributions

You are welcome to contribute to the quality of this content by submitting PR's for additions, fixes and improvements to code snippets, explanations, etc. In case you are not sure or there is any confusion about a phrase, term or definition used, **before submitting a PR, open an issue to ask about it**.

> Note: With your contribution (not just minor typos) to this content, you agree to giving me the right to non-exclusive license and use that content for any future commercial use, like print books.

## Search before submit

In case you have any questions about the content or a code snippet, please make sure to check in [issues](https://github.com/tzeikob/javascript-patterns/issues) page first, there are great chances others in the community having the same concerns. This way we can keep the churn of issues to a minimum.

## Add a pattern

Every pattern should be given as a single `readme.md` file and placed under a specific category in the table of contents. Within that file the structure of the text should follow the template below.

```markdown
# Pattern Name

A short introduction about the pattern...

## Explanation

### Sub-section short phrase

Short paragraphs followed by code snippets...

### Sub-section short phrase

...

## Considerations

### Consideration short phrase

Short paragraphs followed by code snippets...

### Consideration short phrase

...

## Implementations

Below you can find various trivial or real-world implementations of this pattern:

 * [Parallel Reducer](parallel-reducer.js): A short description about the implementation
 * ...
```

Every implementation file should be given as a JavaScript file in the same folder the `readme.md` file exists. Each file should have a name with all characters in lowercase and words separated by hyphens, like `parallel-reducer.js`.

## Fix typos

In case you are about to submit a PR for typo fixes, please consider in doing this by collecting several typos into a single PR with separate commits.

## Work in progress

The current edition of this content is pushed in the default branch and must considered as a work **in progress**. While this content is in progress, contributions are welcome, but it's impossible to turn back in 1st edition while I'm still working on this current version.

Please note that I **am not accepting any contributions** for 1st edition any more.

## Pull request guidelines

The title of every PR should be a short phrase pointing to what this PR is all about, where the first character should always be in uppercase and the rest in lowercase. In case the PR is related to a specific reported issue include its number in the form `(#issue-number)` at the end of the title.

> Note: Please do not use special characters or emoticons in the title, titles like `fix => typo` will not be accepted.

A good example of a title is, `Add implementation of the parallel execution using async/await (#13)`.

Every PR should have a description with the following template.

```
Category: <Behavioral>
Pattern: <Observer>
Label: <Fix, Feature, Improvement, Typo, etc.>
Issue: <#13>
Description: <Free text>
```

If the PR is not related to an issue then just ignore the issue line.