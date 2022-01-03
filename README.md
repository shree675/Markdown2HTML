# Markdown2HTMLBooklet
> ssg \<command\> [options]

## About
A CLI tool that takes a series of markdown files as input and creates a fully-deployable book of static HTML web pages.
Usage:
```
$ ssg create
```

## Features
* Creates a digital book of markdown pages that can be readily deployed.
* Uses an eye-pleasing dark mode book theme.
* Supports all basic [markdown syntax elements](https://github.com/shree675/Markdown2HTML/tree/main#supported-markdown-syntax) along with a few additional syntax elements.
* Automatically resolves image file paths mentioned in the markdown syntax for images ```[alt text](path/to/image)``` and copies the images from the path mentioned to an in-house folder.
* Supports [nested syntax elements](https://github.com/shree675/Markdown2HTML/tree/main#more-insight).
* Supports most of the HTML elements by default<sup><a href="https://github.com/shree675/Markdown2HTML/tree/main#notes">1</a></sup>.

## Demonstration

## Supported Markdown Syntax
| Element | Syntax |
| ------- | ------ |
| Heading | `# H1` `## H2` `### H3` |
| Bold | `**bold**` |
| Italic | `*italic*` |
| Bold + Italic | `***bolditalic***` `**_bolditalic_**` |
| Block quote | `> block` |
| Single line code | ``` `code` ``` ` ```code``` ` |
| Fenced code | ` ```\n code \n``` ` |
| Ordered list | `1. List item` |
| Unordered list | `* List item` |
| Horizantal rule | `---` `--- ---` `-- - -- - - -` etc. |
| Link | `[link](path)` |
| Image | `![alt text](path)` |
| Strikethrough | `~~strike~~` |

## More Insight
The below markdown file...
```md
# Header 1
## Header 2
### Header 3
## Header with **bold**, *italic* and ***bold italic***

This is normal text.

Here is "\<command\>" that is HTML sensitive.

> This is a block.

> ## This is a block with header style and a ```code block **in bold**```


The below is a horizontal line.
- - -  - -

This is a `single line code block`.

Supports most of the HTML tags, for example 2<sup>5</sup>.

Here is a [link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions).

Below is a multi line code block.
` ` `
int abc=0;
for(abc=0;abc<2;abc++){
	print(abc);
}
` ` `

An ordered list:
1. List item 1
2. **_List item 2_** in bold italic
3. List item with a [link again](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions).

These are lists as well:
* first one
* second one

This is a ~~strike through~~. This isn't.

Here is an image:
![alt text](images/image1.png)

Here is another image:
![alt text](/images/image2.png)
```
...is generated as...

## Version
v1.0

## Notes
1. If \<img\> tag is used to render images instead of the syntax ```[alt text](path)```, then make sure to manually add the images into ```your_new_folder_name/assets``` folder. Accordingly, make changes in the **src** attribute of the \<img\> tag.
