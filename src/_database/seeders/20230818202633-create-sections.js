'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Sections',
      [
        {
          name: 'Fiction',
          description: 'Books that tell imaginary stories',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Non-fiction',
          description: 'Books that provide factual information',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Children',
          description: 'Books for young readers',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Sections', null, {});
  },
};
