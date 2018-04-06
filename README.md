# tasap.js
tasap.js is a HTML-Template-Engine meant to build modular HTML-**T**emplates **a**s ~**s**oon~ fast **a**s **p**ossible. Its syntax is compatible with, and falls back to basic HTML. tasap.js allows **no** conditional templates and only provides **minor** options for interpolation. tasap.js allows reusable and nested Modules/Components with an extremely low learning curve, resulting in faster prototyping, efficient preparations and seamless integration.


## Example

### Defining a module
Reusable Modules get defined with the `<Module name="ModuleName">` Tag. The tags-attributes get loaded into the Modules local state and can recieve data on module initialisation.  `-> ./modules/offer.html`
``` html
<Module name="Offer" title="no title set" description="no description" link="#no-link">
	<article class="offer">
		<h3>{{ this.state.title }}</h3>
		<p>
			{{ this.state.description }}
		</p>
		<a href="{{ this.state.link }}">Buy now!</a>
	</article>
</Module>
```

### Passing children to a module
A Module can have unlimited children of any type (tag, text or module). These are automatically loaded into the local state and can be rendered by invoking `this.state.Block()`. `-> ./modules/row.html`
``` html
<Module name="Row">
	<div class="row">
		{{ this.state.Block() }}
	</div>
</Module>
```

### Expressions
tasap.js offers two ways to interact with data. `{{ }}` evaluates the expression and renders its value into the html (see above). `{{# }}` on the other end, doesn't get rendered into the html. `-> ./modules/column.html`
``` html
<Module name="Column">
	{{# this.state.sizes = this.state.sizes.split(' ').map((item)=>'size-' + item) }}
	<div class="column {{ this.state.sizes.join(' ') }}">
		{{ this.state.Block() }}
	</div>
</Module>
```

### Loading Modules
Modules can be anywhere inside the HTML-File. If you move the modules to individual files like I did in this example. You can use `{{@ }}` to load files or directories dynamically. `-> ./index.html`
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
            <h3>Car 2</h3>
            <p> This car is amazing too </p>
            <a href="/link-to-car2.html">Buy now!</a>
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