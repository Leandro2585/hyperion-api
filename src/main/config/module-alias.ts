import { addAlias } from 'module-alias'
import { resolve } from 'path'

addAlias('@app', resolve('build/app'))
addAlias('@main', resolve('build/main'))
addAlias('@infra', resolve('build/infra'))
addAlias('@core', resolve('build/core'))
