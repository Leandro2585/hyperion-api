export const loginPath = {
  post: {
    tags: ['Account'],
    requestBody: {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/loginResult'
            }
          }
        }
      }
    }
  }
}
