interface ResponseData {
  status: boolean
  message: string
  result: any
}

class Helper {
  successResponse(message: string, result: any): ResponseData {
    return {
      status: true,
      message: message,
      result: result,
    }
  }

  errorResponse(message: string = 'Something went wrong!', result: any = null): ResponseData {
    return {
      status: false,
      message: message,
      result: result,
    }
  }
}

export default new Helper()
