import { Knex } from "knex";

const TABLE_NAME = "todos";

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
                         todo: "Learn React",
                         status: "completed",
                         dueDate: "2024-08-12",
                         created_by: 1,
                    },
                    {
                         todo: "Learn REST APIS",
                         status: "incomplete",
                         dueDate: "2024-08-20",
                         created_by: 2,
                    },
               ]);
          });
}
