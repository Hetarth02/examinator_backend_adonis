import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Permission from '#models/permission'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class RolePermission extends BaseModel {
  @column()
  declare role_id: number

  @column()
  declare permission_id: number

  @hasOne(() => Permission, {
    localKey: 'permission_id',
    foreignKey: 'id',
  })
  declare permissions: HasOne<typeof Permission>
}
