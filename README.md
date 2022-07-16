# Markdown2HTMLBooklet
> ssg \<command\> [options]

## About
A CLI tool that takes a series of markdown files as input and creates a fully-deployable book of static HTML web pages.

## Commands
1. ***ssg create***  
Creates a set of linked web pages out of a series of input markdown files.

2. ***ssg deploy***  
Deploys the newly created/updated web pages and provides a shareable website link.

## Features
* Creates a digital book of markdown pages that can be readily deployed.
* Uses an eye-pleasing dark mode book theme.
* Supports all basic [markdown syntax elements](https://github.com/shree675/Markdown2HTML/tree/main#supported-markdown-syntax) along with a few additional syntax elements.
* Automatically resolves image file paths mentioned in the markdown syntax for images ```![alt text](path/to/image)``` and copies the images from the path mentioned to an in-house folder.
* Supports [nested syntax elements](https://github.com/shree675/Markdown2HTML/tree/main#more-insight).
* Supports most of the HTML elements by default<sup><a href="https://github.com/shree675/Markdown2HTMLBooklet#note">1</a></sup>.
* CSS styles are obtained from a paste in [pastebin](https://pastebin.com/) using the pastebin API. So, the CSS styles can be modified without having to change the code.
* Uses [netlify](https://www.netlify.com/) as a hosting service for deploying the web pages using the netlify API.
* The web pages can be easily and quickly deployed within just a few seconds using a single command. Refer to the demo below.

## Demonstration

Create a book of web pages:

<img src="https://user-images.githubusercontent.com/58718144/147938652-2a00cf14-ddf0-40a6-978c-23458d77fde5.gif" width="512"></img>

Output:

<img src="assets/ssgdemo.gif" width="712"></img>

Deploy the created book [optional]:

<img src="https://user-images.githubusercontent.com/58718144/148021530-a902a870-a5c3-41e1-b386-3e7c83cfd24b.gif" width="512"></img>

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
| Horizontal rule | `---` `--- ---` `-- - -- - - -` etc. |
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
...is converted into...

<img src="assets/ssgdemo2.gif" width="725"></img>

## Version
v1.0

## Note
If \<img\> tag is used to render images instead of the syntax ```![alt text](path)```, then make sure to manually add the images into ```<your_new_folder_name>/assets``` folder. Accordingly, make changes in the **src** attribute of the \<img\> tag.
