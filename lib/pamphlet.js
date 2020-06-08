import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { baseKeymap } from 'prosemirror-commands'
import { buildInputRules, buildKeymap } from 'prosemirror-example-setup'
import { buildMarkdownRules } from './markdown-rules'
import { dropCursor } from 'prosemirror-dropcursor'
import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown'
import { toggleLink } from './toggle-link'

export default class Pamphlet {
  constructor (container, content = '') {
    this.container = container
    this.view = this.createView(content)
  }

  createState (content) {
    return EditorState.create({
      schema,
      doc: defaultMarkdownParser.parse(content),
      plugins: [
        buildInputRules(schema),
        buildMarkdownRules(schema),
        history(),
        keymap(buildKeymap(schema)),
        keymap({ 'Mod-h': toggleLink, 'Mod-H': toggleLink }),
        keymap(baseKeymap),
        dropCursor()
      ]
    })
  }

  createView (content) {
    var state = this.createState(content)
    var view = new EditorView(this.container, { state })
    view.dom.style.preWrap = 'pre-wrap'
    return view
  }

  get content () {
    return defaultMarkdownSerializer.serialize(this.view.state.doc)
  }

  set content (content) {
    this.view.destroy()
    this.view = this.createView(content)
  }

  get state () {
    return this.view.state
  }
}