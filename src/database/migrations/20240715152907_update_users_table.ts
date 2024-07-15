import { Knex } from "knex";
const TABLE_NAME = "users";
/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
     return knex.schema.alterTable(TABLE_NAME, (table) => {
          table.string("password", 200).notNullable().alter();
     });
}
/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
     return knex.schema.alterTable(TABLE_NAME, (table) => {
          table.string("password", 50).notNullable().alter();
     });
}
