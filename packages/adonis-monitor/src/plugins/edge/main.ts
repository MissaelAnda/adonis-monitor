import { PluginFn } from 'edge.js/types'
import { viewsRoot } from '../../../resources/views/main.js'

export default function monitorPlugin(): PluginFn<{}> {
  return (edge) => {
    edge.mount('monitor', viewsRoot)
  }
}
