# sprout-cli

A command-line interface for [sprout](http://github.com/carrot/sprout).

## Installation

```sh
$ npm install sprout-cli --global
```

## Try 'er out

Try the [sprout-express template](http://www.github.com/carrot/sprout-express) for generating a boilerplate [express](http://expressjs.org) app:

```sh
$ sprout add express git@github.com:carrot/sprout-express
$ sprout init express ~/Projects/sprout-express-instance
```

## Commands

Sprout can be used directly through the command line to initialize projects. Once installed, it exposes the `sprout` command, which you can use to add, remove, and/or use your templates. The command line interface stores templates in a user folder, typically `~/.config/sprout`. The commands are more or less what you would expect, and are listed below.

#### sprout add

```
$ sprout add <name> <src>
```

**Description**: Adds a template to your repertoire from `src` as `name`. Name represents how you would like the template to be named within sprout. You are required to add a _template_ which can be either a clone url or a path to a local template. If no name is provided, sprout will use the last piece of the template as the name.

**Options**:

* `-v, --verbose`: Verbose mode.

#### sprout remove

```
$ sprout remove <name>
```

**Description**: Removes the template with the specified `name` from sprout.

**Options**:

* `-v, --verbose`: Verbose mode.

**Aliases**: `rm`, `delete`

#### sprout list

```
$ sprout list
```
**Description**: Lists all templates that you have added to sprout.

**Aliases**: `ls`, `all`

#### sprout init

```sh
$ sprout init <name> <target>
```

**Description**: Initializes the template with the given `name` at the given `target`.

**Options**:

* `-l [LOCALS [LOCALS ...]]`, `--locals [LOCALS [LOCALS ...]]`:
  Pass locals as options which will override the prompts set in your templates.  Locals are passed to the CLI like so: `-l key1=value1 key2='value2'`

* `-t TAG`, `--tag TAG`:
  Pass a git tag to generate the template from.

* `-b BRANCH`, `--branch BRANCH`:
  Pass a git branch to generate the template from.

* `-c CONFIG`, `--config CONFIG`:
  Pass a JSON or yaml file to pre-define a large set of values, like so:

  ```json
  {
    "key1": "value1",
    "key2": true,
    "key3": 200
  }
  ```

**Aliases**: `new`, `create`

#### sprout run

```sh
$ sprout run <name> <generator>
```

**Description**: Run a generator named `generator`, provided in a template with the given `name`, on a template instance in the current working directory.

**Options**:

  * `-t TARGET`, `--target TARGET`
    Optionally pass the path to the template instance (relative to the current working directory).

  * `[args, [args ...]]`
    Pass arguments to the generator, like so:

    ```sh
    $ sprout run mvc model User name:string age:integer
    ```

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](CONTRIBUTING.md)
