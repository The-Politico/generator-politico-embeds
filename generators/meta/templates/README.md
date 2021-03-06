# <%=title%>

#### Embed code

Your embed code is dependent on the filename of the embed HTML in `src/templates/graphics/`. The default embed provided is called `graphic.html`, so the embed code is:

```
<div id="graphic"></div>

<script src="//pym.nprapps.org/pym.v1.min.js"></script>
<script>new pym.Parent('graphic', 'https://www.politico.com/interactives/<%=path%>graphics/graphic.html', {})</script>
```

Generally, the embed code works like this:

```
<div id="YOUR_EMBED_NAME_HERE"></div>

<script src="//pym.nprapps.org/pym.v1.min.js"></script>
<script>new pym.Parent('YOUR_EMBED_NAME_HERE', 'https://www.politico.com/interactives/<%=path%>graphics/YOUR_EMBED_NAME_HERE.html', {})</script>
```

**NOTE:** If you change the `publishPath` in `meta.json`, you need to adjust the URL in this code, as well.

#### Responsive iframes

We use [pym.js](http://blog.apps.npr.org/pym.js/) to create responsive embeds.

By default, your app has been setup to correctly adjust the height of your iframe on the parent page using the library. If, however, you have dynamic content that updates your embed's height, then you need to explicitly call pym's `sendHeight` method in the child page:

```javascript
import pym from 'pym.js';

const pymChild = new pym.Child();
pymChild.sendHeight(); // Sets initial height

const functionThatChangesContentHeight = () =>{
    // Do stuff here that changes content height...

    // Call sendHeight to update iframe height on parent page
    pymChild.sendHeight();
};


functionThatChangesContentHeight();
```

Sometimes, if you have animations associated with your transitions, you may want to delay the `sendHeight` call. Simply add a timeout:

```javascript
window.setTimeout(() => {pymChild.sendHeight();}, 500);
```

#### Starting a new embed page

To start a new embed page, use the `new-embed` subgenerator by calling `yo politico-interactives:new-embed`. It will ask you for a slug, and then you can see your new embed page by going to `localhost:3000/slug`. 

#### To publish

Make sure you have the correct publish path set in `meta.json` and that you've correctly filled in you AWS access keys in `aws.json`. Then run:

```bash
$ gulp publish
```

Unless you've changed your publishPath in meta.json, your project will be published at:

**[http://www.politico.com/interactives/<%=path%>](http://www.politico.com/interactives/<%=path%>)**
