import { Knex } from "knex";

const TABLE_NAME = "permissions";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
     return knex.schema.table(TABLE_NAME, (table) => {
          table.renameColumn("userId", "user_id");
     });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
     return knex.schema.table(TABLE_NAME, (table) => {
          table.renameColumn("user_id", "userId");
     });
}
