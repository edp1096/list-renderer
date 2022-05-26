# List renderer

Very much limitful list renderer class for the purpose of my personal usage

If one of vue, react, angular is too huge or not fit, try [`knockout.js`](https://github.com/knockout/knockout) or [`mustache.js`](https://github.com/janl/mustache.js), not this :)

See [`deployed page`](https://edp1096.github.io/list-renderer) and [index.html](https://github.com/edp1096/list-renderer/blob/main/index.html)


## Limitation

* Only 1 depth list renderer in container
* Support only
    * `lr-click` and `lr-change` as event
    * `lr-id` as not identifier which is just changed to `data-id`,
    * `$index` as index in the loop data

## Build

* Require [esbuild](https://github.com/evanw/esbuild)

* Typescript

```powershell
$ yarn install
$ yarn module
```

* Javascript

```powershell
$ yarn install
$ yarn browser
```
## Load

### Javascript

```html
<div id="human-container">
    <div lr-loop="human">
        <p><span customattr="{{name}}{{age}}">{{name}} / {{age}}</span></p>
    </div>
</div>

<script src="./dist/list-renderer.js"></script>
<script>
    const human = [
        { name: "John", age: 30 },
        { name: "Jane", age: 20 }
    ]

    const lrHuman = new ListRenderer(document.getElementById("human-container"))
    lrHuman.render()
</script>
```

### Typescript

```html
<div id="human-container">
    <div lr-loop="human">
        <p><span customattr="{{name}}{{age}}">{{name}} / {{age}}</span></p>
    </div>
</div>

<script type="module">
    import ListRenderer from './dist/list-renderer.mjs';

    const lrHuman = new ListRenderer(document.getElementById("human-container"))
    lrHuman.render()

    const lrAnimal = new ListRenderer(document.getElementById("animal-container"))
    lrAnimal.render()

    window.lrAnimal = lrAnimal
    window.lrHuman = lrHuman
</script>
```

## Directives

### lr-loop
* `lr-loop` should be placed only 1 depth under container
* This attribute name in rendered result is removed when done to render or reload
* Value of `lr-loop` means data variable name which is `const human` at below case
* `undefined` values are changed to empty string value("")
```html
<div id="human-container">
    <div lr-loop="human">
        <p><span>{{name}}</span> / {{age}}</p>
    </div>
</div>

<script src="./dist/list-renderer.js"></script>
<script>
    const human = [
        { name: "John", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Joe" },
        { name: "Sam", age: 10 },
        { name: "Sally", age: 5 }
    ]

    const lrHuman = new ListRenderer(document.getElementById("human-container"))
    lrHuman.render()
</script>
```

### lr-if
* This attribute name in rendered result is removed when done to render or reload
* Variable should be placed at left side in condition definition
```html
<div id="animal-container">
    <div lr-loop="animal">
        <div lr-if="age > 5">
            <p>{{name}} / {{age}}</p>
        </div>
        <div lr-if="name == 'Bird'">
            <p>{{name}} / {{age}}</p>
        </div>
    </div>
</div>

<script src="./dist/list-renderer.js"></script>
<script>
    const animal = [
        { name: "Dog", age: 10 },
        { name: "Cat", age: 5 },
        { name: "Bird", age: 2 },
        { name: "Lion", age: 10 },
        { name: "Tiger", age: 5 },
        { name: "Elephant", age: 2 },
    ]

    const lrAnimal = new ListRenderer(document.getElementById("animal-container"))
    lrAnimal.render()
</script>
```

### lr-click
* Same as `onclick` event
* Those attribute name(s) in rendered result are changed to `onclick` when done to render or reload
* Should be placed only in template
* Variable of loop object is not supported, just `$index` can be used
```html
<div id="human-container">
    <div lr-loop="human">
        <p>
            <span>{{name}} / {{age}}</span>
            <button lr-click="showIndex($index)">Show index</button>
        </p>
    </div>
</div>

<script src="./dist/list-renderer.js"></script>
<script>
    function showIndex(index) { alert(index) }

    const human = [
        { name: "John", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Joe" },
        { name: "Sam", age: 10 },
        { name: "Sally", age: 5 }
    ]

    const lrHuman = new ListRenderer(document.getElementById("human-container"))
    lrHuman.render()
</script>
```

### lr-id
* Different with `id` attribute
* Those attribute name(s) in rendered result are changed to `data-id` when done to render or reload
* Should be placed only in template
* Variable of loop object is not supported, just `$index` can be used
* For access the element, use `querySelector("[data-id=human1]")` or `querySelectorAll("[data-id]")`
```html
<div id="human-container">
    <div lr-loop="human">
        <p lr-id="human$index">
            <span>{{name}} / {{age}}</span>
        </p>
    </div>
</div>

<script src="./dist/list-renderer.js"></script>
<script>
    function changeChild(index) { alert(index) }

    const human = [
        { name: "John", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Joe" },
        { name: "Sam", age: 10 },
        { name: "Sally", age: 5 }
    ]

    const lrHuman = new ListRenderer(document.getElementById("human-container"))
    lrHuman.render()
</script>
```

### reload
```html
<button onclick="addHumanData()">Add human data</button>

<div id="human-container">
    <div lr-loop="human">
        <p><span>{{name}}</span> / {{age}}</p>
    </div>
</div>

<script src="./dist/list-renderer.js"></script>
<script>
    function addHumanData() {
        human.push({ name: "Mark", age: "15" })
        human.push({ name: "Richard", age: "25" })
        human.push({ name: "Robert", age: "35" })

        lrHuman.reload()
    }

    const human = [
        { name: "John", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Joe" },
        { name: "Sam", age: 10 },
        { name: "Sally", age: 5 }
    ]

    const lrHuman = new ListRenderer(document.getElementById("human-container"))
    lrHuman.render()
</script>
```


## License

[Public domain.](https://unlicense.org)
