import { addAlias } from 'module-alias'
import { resolve } from 'path'

addAlias('@app', resolve('build/app'))
addAlias('@data', resolve('build/data'))
addAlias('@main', resolve('build/main'))
addAlias('@infra', resolve('build/infra'))
addAlias('@domain', resolve('build/domain'))
