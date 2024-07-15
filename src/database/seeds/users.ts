import { Knex } from "knex";

const TABLE_NAME = "users";

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
                         name: "user1",
                         email: "user1@g.com",
                         password:
                              "$2b$10$N5zpXnpAd9yqwebahVEYHeT2APESXkefOkCLwb3484TLirasXMDqe",
                    },
                    {
                         name: "user2",
                         email: "user2@g.com",
                         password:
                              "$2b$10$N5zpXnpAd9yqwebahVEYHeT2APESXkefOkCLwb3484TLirasXMDqe",
                    },
               ]);
          });
}
