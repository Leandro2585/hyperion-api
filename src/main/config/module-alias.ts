import { addAlias } from 'module-alias'
import { resolve } from 'path'
import { readdirSync } from 'fs'

const rootPath = process.env.TS_NODE_DEV === undefined ? 'build' : 'src'
const layers = readdirSync(resolve(__dirname, '..', '..', '..', rootPath))

layers.forEach((layer: string) => {
  addAlias(`@${layer}`, resolve(`${rootPath}/${layer}`))
})
