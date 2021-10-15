<!--
author:   André Dietrich

email:    LiaScript@web.de

version:  0.0.1

logo:     https://semanticweb.cs.vu.nl/R/sparql_hollywood/sparql_hollywood_files/Screen-Shot-2012-09-28-at-20.27.12.png

language: en

narrator: US English Female

comment:  A macro library for trying and playing with SPARQL and RDF that is
          based on Communica.

script:   https://cdn.jsdelivr.net/gh/liatemplates/communica@0.0.1/dist/index.js

@Communica.SPARQL
<script>
  function output(ok, message) {
    if (ok) send.lia(message)
    else {
      let errMessage = []
      let err = message.match(/Parse error on line (\d+)[^\n]\n((?:.|\n)+)/)

      if (err.length >= 3) {
        errMessage = [[{
          row : parseInt(err[1]) - 1,
          column : 1,
          text : err[2],
          type : "error"
        }]]
      }

      send.lia(message, errMessage, false)
    }
  }

  window.RDF.query(`@input`, output, [] )

  "LIA: wait"
</script>
@end

@Communica.RDF_SPARQL
<script>
  function output(ok, message) {
    if (ok) send.lia(message)
    else {
      let errMessage = []
      let err = message.match(/Parse error on line (\d+)[^\n]\n((?:.|\n)+)/)

      if (err.length >= 3) {
        errMessage = [[], [{
          row : parseInt(err[1]) - 1,
          column : 1,
          text : err[2],
          type : "error"
        }]]
      }

      send.lia(message, errMessage, false)
    }
  }

  window.RDF.parse.rdf(`@input`).then((e) => {
    window.RDF.query(`@input(1)`, output, [ e ] )
  })

  "LIA: wait"
</script>
@end

-->

# Communica - Template

                          --{{0}}--
This document defines some basic [LiaScript](https://LiaScript.github.io)-macros
for dealing and experimenting with the semantic web-technologies, such as
querying [SPARQL](https://en.wikipedia.org/wiki/SPARQL) and or dealing with
[RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework) in the form
of [turtle](https://en.wikipedia.org/wiki/Turtle_%28syntax%29). Others are about
to come. This template is mainly based on [Communica](https://comunica.dev) an
open-source knowledge graph querying framework. I hope in the future, there will
be more functions available. At the moment it is possible to execute and edit
code-blocks with SPARQL queries.

__Try it on LiaScript:__

https://liascript.github.io/course/?https://raw.githubusercontent.com/liaTemplates/Communica/main/README.md

__See the project on Github:__

https://github.com/liaTemplates/Communica

                         --{{1}}--
There are three ways to use this template. The easiest way is to use the
`import` statement and the url of the raw text-file of the master branch or any
other branch or version. But you can also copy the required functionionality
directly into the header of your Markdown document, see therefor the [last
slide](#implementation). And of course, you could also clone this project and
change it, as you wish.

                           {{1}}
1. Load the macros via

   `import: https://raw.githubusercontent.com/LiaTemplates/Communica/0.0.1/README.md`

2. Copy the definitions into your Project

3. Clone this repository on GitHub

## Minimal Requirements

                         --{{0}}--
What is actually needed to make your Markdown code-snippets with
[SPARQL](https://en.wikipedia.org/wiki/SPARQL) executable and editable? Not
much, simply add the following comment to the head of your Markdown document.

``` markdown
<!--
import: https://raw.githubusercontent.com/LiaTemplates/Communica/0.0.1/README.md
-->

# Title

...
```

                         --{{1}}--
And finally attach the macros/functions, which are defined by this document, to
the end of a code-block. You can define as much code-blocks as you want.


                           {{1}}
```` markdown
``` sparql
# source: http://fragments.dbpedia.org/2015/en

SELECT ?s ?p ?o WHERE {
  ?s ?p <http://dbpedia.org/resource/Ukraine>.
  ?s ?p ?o
} LIMIT 100
```
@Communica.SPARQL
````


## Macros

                          --{{0}}--
Currently you can use two macros, which can also be tweaked a bit. We will
describe them both within this section.

1. `@Communica.SPARQL`
2. `@Communica.RDF_SPARQL`


### `@Communica.SPARQL`

                          --{{0}}--
Add the macro `@Communica.SPARQL` to the end of your
[SPARQL](https://en.wikipedia.org/wiki/SPARQL) query to make it executable and
editable. You can add as much blocks as you want to.

```` markdown
``` sparql
# source: http://fragments.dbpedia.org/2015/en

SELECT ?s ?p ?o WHERE {
  ?s ?p <http://dbpedia.org/resource/Ukraine>.
  ?s ?p ?o
} LIMIT 10
```
@Communica.SPARQL
````

                          --{{1}}--
The result will look as follows, you can execute it, change the code of the
query and go back and forth between your version.

                            {{1}}
``` sparql
# source: http://fragments.dbpedia.org/2015/en

SELECT ?s ?p ?o WHERE {
  ?s ?p <http://dbpedia.org/resource/Ukraine>.
  ?s ?p ?o
} LIMIT 10
```
@Communica.SPARQL


                          --{{1}}--
And to some extend also the errors are propagated to the user.

                            {{2}}
``` sparql
# source: http://fragments.dbpedia.org/2015/en

SELECT ?s ?p ?o WHERE {
  ?s ?p <http://dbpedia.org/resource/Ukraine>
  ?s ?p ?o
} LIMIT 10
```
@Communica.SPARQL

#### Sources

                          --{{0}}--
As you have seen earlier, it is possible by you and by your user to define the
sources for your query. Simply add one or multiple comments of the following
form into your code-block. If you use a one-liner, your sources have to be
separated by one space.

``` sparql
# source: http://fragments.dbpedia.org/2015/en
# source: https://www.rubensworks.net https://ruben.verborgh.org/profile/

SELECT ?s ?p ?o WHERE {
?s ?p <http://dbpedia.org/resource/Belgium>.
?s ?p ?o
} LIMIT 100
```
@Communica.SPARQL


#### Formats

                          --{{0}}--
It is possible to define different output formats, simply by adding an comment
of the form `# format: _`.

``` sparql
# format: table
# source: http://fragments.dbpedia.org/2015/en

SELECT ?s ?p ?o WHERE {
?s ?p <http://dbpedia.org/resource/Ukraine>.
?s ?p ?o
} LIMIT 5
```
@Communica.SPARQL

                          --{{1}}--
The default format is currently `table`, however, you can overwrite this by one
of the following media types. All possible formats are defined
[here](https://comunica.dev/docs/query/advanced/result_formats/). However,
currently it only possible to use a subset of them, which are highlighted in the
table.

                            {{1}}
| Media type                        | Supported | Description                                                                      |
| --------------------------------- |:---------:| -------------------------------------------------------------------------------- |
| `application/json`                |    ✅     | A custom, simplified JSON result format.                                         |
| `simple`                          |    ✅     | A custom, text-based result format.                                              |
| `application/sparql-results+json` |    ✅     | The [SPARQL/JSON](https://www.w3.org/TR/sparql11-results-json) results format.   |
| `application/sparql-results+xml`  |    ❌     | The [SPARQL/XML](https://www.w3.org/TR/rdf-sparql-XMLres) results format.        |
| `text/csv`                        |    ✅     | The [SPARQL/CSV](https://www.w3.org/TR/sparql11-results-csv-tsv) results format. |
| `text/tab-separated-values`       |    ✅     | The [SPARQL/TSV](https://www.w3.org/TR/sparql11-results-csv-tsv) results format. |
| `stats`                           |    ❌     | A custom results format for testing and debugging.                               |
| `table`                           |    ✅     | A text-based visual table result format.                                         |
| `tree`                            |    ❌     | A tree-based result format for GraphQL-LD result compacting.                     |
| `application/trig`                |    ❌     | The [TriG](https://www.w3.org/TR/trig) RDF serialization.                        |
| `application/n-quads`             |    ❌     | The [N-Quads](https://www.w3.org/TR/n-quads) RDF serialization.                  |
| `text/turtle`                     |    ❌     | The [Turtle](https://www.w3.org/TR/turtle) RDF serialization.                    |
| `application/n-triples`           |    ❌     | The [N-Triples](https://www.w3.org/TR/n-triples) RDF serialization.              |
| `text/n3`                         |    ❌     | The [Notation3](https://www.w3.org/TeamSubmission/n3) serialization.             |
| `application/ld+json`             |    ❌     | The [JSON-LD](https://json-ld.org) RDF serialization.                            |


### `@Communica.RDF_SPARQL`

                          --{{0}}--
It is possible also to define your own files and to query them, by combining two
Markdown-blocks in conjunction. The first contains your turtle file, while the
second code-block contains your query.

```` markdown
``` turtle       Turtle
@prefix :     <http://www.example.org/sample.rdfs#> .
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.

:Dog      rdfs:subClassOf :Animal.
:Person   rdfs:subClassOf :Animal.

:hasChild rdfs:range :Animal;
          rdfs:domain :Animal.
:hasSon   rdfs:subPropertyOf :hasChild.

:Max      a :Dog.
:Abel     a :Person.
:Adam     a :Person;
            :hasSon :Abel.
```
``` sparql      -SPARQL-Query
SELECT * {
  ?s ?p ?o
} LIMIT 5
```
@Communica.RDF_SPARQL
````

                          --{{1}}--
The text behind the language definition is used as a title for your code-block,
whereby a starting `+` or `-` define, wheather the editor view should be opened
or closed.

                            {{1}}
``` turtle       Turtle
@prefix :     <http://www.example.org/sample.rdfs#> .
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.

:Dog      rdfs:subClassOf :Animal.
:Person   rdfs:subClassOf :Animal.

:hasChild rdfs:range :Animal;
          rdfs:domain :Animal.
:hasSon   rdfs:subPropertyOf :hasChild.

:Max      a :Dog.
:Abel     a :Person.
:Adam     a :Person;
            :hasSon :Abel.
```
``` sparql      -SPARQL-Query
# format: simple
# source: http://fragments.dbpedia.org/2015/en

SELECT * {
  ?s ?p ?o
} LIMIT 5
```
@Communica.RDF_SPARQL


                          --{{2}}--
It is still possible to add different sources or to change the output format, as
described before.

## Implementation


All the functionionality is defined within the main-comment of this document. It
makes use of the typescript-functions defined in `src/index.ts`, which defines a
global object `ẁindow.RDF`.

``` html
script:   dist/index.js

@Communica.SPARQL
<script>
  function output(ok, message) {
    if (ok) send.lia(message)
    else {
      let errMessage = []
      let err = message.match(/Parse error on line (\d+)[^\n]\n((?:.|\n)+)/)

      if (err.length >= 3) {
        errMessage = [[{
          row : parseInt(err[1]) - 1,
          column : 1,
          text : err[2],
          type : "error"
        }]]
      }

      send.lia(message, errMessage, false)
    }
  }

  window.RDF.query(`@input`, output, [] )

  "LIA: wait"
</script>
@end

@Communica.RDF_SPARQL
<script>
  function output(ok, message) {
    if (ok) send.lia(message)
    else {
      let errMessage = []
      let err = message.match(/Parse error on line (\d+)[^\n]\n((?:.|\n)+)/)

      if (err.length >= 3) {
        errMessage = [[], [{
          row : parseInt(err[1]) - 1,
          column : 1,
          text : err[2],
          type : "error"
        }]]
      }

      send.lia(message, errMessage, false)
    }
  }

  window.RDF.parse.rdf(`@input`).then((e) => {
    window.RDF.query(`@input(1)`, output, [ e ] )
  })

  "LIA: wait"
</script>
@end
```

                          --{{1}}--
If you want to build this project by your own, then follow the following
instructions:

                            {{1}}
``` bash
$ git clone https://github.com/LiaTemplates/Communica

$ cd Communica

$ git checkout dev

$ npm i

$ npm run build
```
