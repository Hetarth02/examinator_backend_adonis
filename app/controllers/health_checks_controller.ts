import { healthChecks } from '#start/health'
import type { HttpContext } from '@adonisjs/core/http'

export default class HealthChecksController {
  async handle({ response }: HttpContext) {
    const report = await healthChecks.run()

    if (report.isHealthy) {
      return response.ok({
        status: report.status,
        isHealthy: report.isHealthy,
      })
    }

    return response.serviceUnavailable({
      status: report.status,
      isHealthy: report.isHealthy,
    })
  }
}
