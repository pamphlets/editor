import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { baseKeymap } from 'prosemirror-commands'
import { buildInputRules, buildKeymap } from 'prosemirror-example-setup'
import { buildMarkdownRules } from './rules'
import { dropCursor } from 'prosemirror-dropcursor'
import { formatCurrentNode, removeNodeFormatting } from './commands'
import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown'

var corePlugins = [
  buildInputRules(schema),
  buildMarkdownRules(),
  history(),
  keymap(buildKeymap(schema)),
  keymap({ 'Alt-f': formatCurrentNode, 'Alt-r': removeNodeFormatting }),
  keymap(baseKeymap),
  dropCursor()
]

export default class Pamphlet {
  constructor (container, content = '', opts = {}) {
    if (typeof content === 'object') {
      opts = content
      content = ''
    }

    opts.plugins = opts.plugins || []

    this.container = container
    this.plugins = opts.plugins.concat(corePlugins)
    this.state = this.createState(content)
    this.view = this.createView()
  }

  createState (content) {
    return EditorState.create({
      schema,
      doc: this.parse(content),
      plugins: this.plugins
    })
  }

  createView () {
    return new EditorView(this.container, { state: this.state })
  }

  parse (content) {
    return defaultMarkdownParser.parse(content)
  }

  serialize (slice) {
    return defaultMarkdownSerializer.serialize(slice)
  }

  get content () {
    return this.serialize(this.view.state.doc)
  }

  set content (content) {
    this.view.destroy()

    this.state = this.createState(content)
    this.view = this.createView()
  }
}