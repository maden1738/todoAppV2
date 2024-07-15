import { Knex } from "knex";

const TABLE_NAME = "permissions";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
     return knex(TABLE_NAME)
          .del()
          .then(() => {
               return knex(TABLE_NAME).insert([
                    {
                         userId: 1,
                         permission: "superAdmin",
                    },
                    {
                         userId: 2,
                         permission: "user",
                    },
                    {
                         userId: 1,
                         permission: "user",
                    },
               ]);
          });
}
