import schemas from './schemas'
import paths from './paths'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Hyperion API',
    description: 'NodeJS Api server template using concepts design patterns, clean code and SOLID principles',
    version: '0.0.1'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Account'
  }],
  components,
  schemas,
  paths
}
