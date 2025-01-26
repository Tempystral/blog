---
title: Image_import_notes
description: 'Please enter a description of your post here, between 50-160 chars!'
publishDate: 25 January 2025
tags: []
draft: false
---
It's annoying to import images from a local path in Astro!
- Every resource including their own docs just say to put your images in the assets folder
  - This is fine except it's not how my blog is set up in Hugo
  - I like storing things locally because it keeps my data all in one place

- Show examples of how Astro says to do it
- Another solution: https://www.emgoto.com/astro-blog-images/#rendering-astro-images-inside-of-react-components but not quite what I wanted
- I want to actually use a custom component, like my shortcodes in Hugo

Emma's use-case was for grabbing a bunch of images which themselves seem to have been imported directly into mdx files, for use in another file. I wanted to reference a file by URL and not import it directly.

As a result, Emma's solution involved globbing her image files and then iterating over a collection of posts to get the imported image object from each one. For me, I just needed the _current_ post being built. For this I was able to use Astro's global url property to get the current file for processing, which let me single out the image I was trying to _actually_ resolve immediately.

Why not use dynamic `import()`s? I don't know why but it doesn't work!


## Replacing shortcodes with components
I don't want to do this by hand. I'm a programmer!
- Started writing my own replacer
- Weird issue where fs.writeFileSync wouldn't write?
- Used [replace-in-file](https://github.com/adamreisnz/replace-in-file)

- Not sure what the output is actually gonna look like, and I'm in JS so I don't get the help of the type system
- [Helpful resource](https://www.codemzy.com/blog/regex-groups-with-replace) explains you can create a replacer method
- I had already made one and it turns out the replace method does output named capture groups in the order you specify them
- This means I could actually move around the text to check (also made possible by my regex having lookaheads) and the arguments would still come in the same
- Just had to add a first `match` argument to my replacer method

## The MDX Plugin is new and that means it's not feature-rich
One annoying thing about MDX is the language server isn't very good. You don't get autocompletion for imports like with other languages and you have to put these ugly imports at the top of your markdown file. I'm not doing that for every file!

This person had the same use case for astro/MDX as me, so I'm following their example: https://rimdev.io/automatically-import-components-in-astro-mdx
- The trick to this is that the layout itself doesn't render the content. Posts are stored in a collection, so the _collection_ defines the content, and the layout itself is used by that collection to display the page.
- As it turns out they literally addressed this issue in the plugin today so maybe I don't need this change: https://github.com/mdx-js/mdx-analyzer/pull/491
