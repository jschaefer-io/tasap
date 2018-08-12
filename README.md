# tasap.js
tasap.js is a HTML-Template-Engine meant to build modular HTML-**T**emplates **a**s ~**s**oon~ fast **a**s **p**ossible. Its syntax is compatible with, and falls back to basic HTML. tasap.js allows **no** conditional templates and only provides **minor** options for interpolation. tasap.js allows reusable and nested Modules/Components with an extremely low learning curve, resulting in faster prototyping, efficient preparations and seamless integration.


## Example

### Defining a module
Reusable Modules get defined with the `<Module name="ModuleName">` Tag. The tags-attributes get loaded into the Modules local state and can recieve data on module initialisation.  `-> ./modules/offer.html`
``` html
<Module name="Offer" title="no title set" description="no description" link="#no-link">
	<article class="offer">
		<h3>{{ state.title }}</h3>
		<p>
			{{ state.description }}
		</p>
		<a href="{{ state.link }}">Buy now!</a>
	</article>
</Module>
```

### Passing children to a module
A Module can have unlimited children of any type (tags, text or modules). These are automatically loaded into the local state and can be rendered by invoking `Block()` **or** `state.Block()`. `-> ./modules/row.html`
``` html
<Module name="Row">
	<div class="row">
		{{ Block() }}
	</div>
</Module>
```

### Expressions
tasap.js offers two ways to interact with data. `{{ }}` evaluates the expression and renders its value into the html (see above). `{{# }}` on the other end, does not get rendered into the html. `-> ./modules/column.html`
``` html
<Module name="Column" sizes>
	{{# state.sizes = utils.prefixArray(utils.toArray(state.sizes), 'size-') }}
	<div class="column {{ state.sizes.join(' ') }}">
		{{ Block() }}
	</div>
</Module>
```

### Loading Modules
Modules can be defined anywhere inside the HTML-File. If you move the modules to individual files like I did in this example. You can use `{{@ }}` to load files or directories dynamically.
 Individual modules get invoked by using their name as the html-tag. `-> ./index.html`
``` html
{{@ ./modules/*.html }}
<Row>
	<Column sizes="small-12 medium-3 large-7">
		<Offer title="Car 1" description="This car is amazing" link="/link-to-car1.html"></Offer>
	</Column>
	<Column sizes="small-12 medium-3 large-7">
		<Offer title="Car 2" description="This car is amazing too" link="/link-to-car2.html"></Offer>
	</Column>
</Row>
```

### Compiles into:
The above example renders into the following HTML Content.
``` html
<div class="row">
    <div class="column size-small-12 size-medium-3 size-large-7">
        <article class="offer">
            <h3>Car 1</h3>
            <p> This car is amazing </p>
            <a href="/link-to-car1.html">Buy now!</a>
        </article>
    </div>
    <div class="column size-small-12 size-medium-3 size-large-7">
        <article class="offer">
            <h3>Car 2</h3>
            <p> This car is amazing too </p>
            <a href="/link-to-car2.html">Buy now!</a>
        </article>
    </div>
</div>
````

## Dynamic Tags
tasap.js uses a special attribute identifier prefixed with `@`. Currently the only use for these attributes are dynamic changing of html tagnames.
All attributes starting with `@` will **not** get rendered in the finished html.

Using the `@tag` attribute replaces its tagname with the attribute value if it is not empty or `undefined`.
``` html
<Module name="MyModule" tag>
	<div @tag="{{ state.tag }}"></div>
</Module>

<MyModule></MyModule>
<MyModule tag="article"></MyModule>
<MyModule tag="section"></MyModule>
```
### Compiles into:
``` html
<div></div>
<article></article>
<section></section>
```

## Utility Methods
tasap.js comes with a small utils API of utility functions helping processing and modifying state.
``` javascript
// Transform a string to an array
utils.toArray(string, 'delimiter')

// Prefix every string in an array
utils.prefixArray(array, 'prefix')

// Suffix every string in an array
utils.suffixArray(array, 'suffix')
```

This utils API gets exposed outside of the internal tasap-workflow. This allows you to use these methods outside of tasap.js and mainly extend the utility class with custom static variables and methods.

``` javascript
const tasap = require('tasap');
tasap.utils.myFunction = function(){
    return 'Hello World';
}
tasap.utils.myVariables = 123;
```
and in the tasap html-files
``` html
<Module name="MyModule">
    <p> Function: {{ utils.myFunction() }} </p>
    <p> Variable: {{ utils.myVariables }} </p>
</Module>

<MyModule></MyModule>
```
### Compiles into:
``` html
<p> Function: Hello World </p>
<p> Variable: 123 </p>
```

## Usage

``` javascript
const tasap = require('tasap');

// Compiling single fiels or content
tasap.get(['header.html', 'index.html', 'footer.html']); // Compiles all files into one files and returns the result
tasap.get('<div></div>'); // Compiles the given Content

// Compiling multiple files
tasap.getAll(['header.html', 'index.html', 'footer.html']); // Compiles all files into sepearte fiels and returns the array

// Compile and write file
tasap.writeFile(['index.html'], 'dist/index.html'); // Writes the compiled file to the target directory
tasap.writeFile('<div></div>', 'dist/index.html'); // Compiles the given Content and writes it to the target directory
tasap.writeAll('templates/*.html', 'dist/'); // Compiles all matching files to the target directory
```