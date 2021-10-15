const Engine = require('../node_modules/@comunica/actor-init-sparql').newEngine

import { Bus } from '@comunica/core'
import { MediatorRace } from '@comunica/mediator-race'
import { ActorInitRdfParse } from '@comunica/actor-init-rdf-parse'
import { ActorRdfParseN3 } from '@comunica/actor-rdf-parse-n3'

const N3Store = require('n3').Store
const DataFactory = require('n3').DataFactory

const stringToStream = require('streamify-string')
const arrayifyStream = require('arrayify-stream')

function format(query: string) {
  let result = 'table'
  try {
    result = [...query.matchAll(/#\s*format:\s*(\S+)/g)][0][1]
  } catch (e) {
    console.warn('SPARQL', e)
  }

  return result
}

function sources(query) {
  let result = []

  try {
    const matches = query.matchAll(/#\s*sources?:\s*([^\n]+)/g)

    for (const match of matches) {
      result.push(match[1].split(' ').map((s) => s.trim()))
    }
  } catch (e) {
    console.warn('SPARQL', e)
  }

  return result.flat()
}

global.RDF = {
  parse: {
    rdf: async function (code: string) {
      let bus = new Bus({ name: 'bus' })
      let busInit = new Bus({ name: 'bus-init' })
      let mediator = new MediatorRace({ name: 'mediator', bus: busInit })

      let actor = new ActorInitRdfParse({
        name: 'actor',
        bus,
        mediatorRdfParse: mediator,
        mediaType: 'text/turtle',
      })

      busInit.subscribe(
        new ActorRdfParseN3({
          bus,
          mediaTypes: {
            'application/trig': 1,
            'application/n-quads': 0.7,
            'text/turtle': 0.6,
            'application/n-triples': 0.3,
            'text/n3': 0.2,
          },
          name: 'actor-rdf-parse',
        })
      )
      let input = stringToStream(code)

      return actor
        .run({ argv: ['text/turtle'], env: {}, stdin: input })
        .then((stream) => arrayifyStream(stream.stdout))
        .then((data) => {
          const store = new N3Store()

          data = data.map((b: any) => JSON.parse(b.toString()))

          for (const quad of data) {
            store.addQuad(quad.subject, quad.predicate, quad.object, quad.graph)
          }
          return store
        })
    },
  },

  query: async function (
    query: string,
    send: (ok: boolean, message: string) => void,
    store: any[]
  ) {
    try {
      const engine = Engine()
      const result = await engine.query(query, {
        sources: store.concat(sources(query)),
      })

      const { data } = await engine.resultToString(result, format(query))

      result.bindingsStream.on('end', () => {
        send(true, new TextDecoder().decode(data.read()))
      })
    } catch (e) {
      send(false, e.message)
    }
  },
}
