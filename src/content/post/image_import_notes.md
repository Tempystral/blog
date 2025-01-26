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
