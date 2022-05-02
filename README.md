# List renderer

Very much limitful list renderer class for my personal usage purpose

If one of vue, react, angular is too huge or not fit, try [`knockout.js`](https://github.com/knockout/knockout)

See [`deployed page`](https://edp1096.github.io/list-renderer) and [index.html](https://github.com/edp1096/list-renderer/blob/main/index.html)


## Limitation

* Only an 1 depth list renderer in container
* Also only 1 depth(s) if in list
* Support only `lr-click` and `$index` as event

## Usage

### lr-loop
* `lr-loop` should be placed only 1 depth under container
* Value of `lr-loop` means data variable name which is `const human` at below case
```html
<div id="human-container">
    <div lr-loop="human">
        <p><span>{{name}}</span> / {{age}}</p>
    </div>
</div>

<script src="list-renderer.js"></script>
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
* `lr-if` should be placed only 1 depth under `lr-loop`
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

<script src="list-renderer.js"></script>
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
* Can be placed in template
* Variable usage is not supported, only `$index` can be used
```html
<div id="human-container">
    <div lr-loop="human">
        <p><span>{{name}}</span> / {{age}} <button lr-click="showIndex($index)">Show index</button></p>
    </div>
</div>

<script src="list-renderer.js"></script>
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
