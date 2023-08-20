'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      author: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      summary: {
        type: Sequelize.STRING,
      },
      cover: {
        type: Sequelize.STRING,
      },
      copies: {
        type: Sequelize.INTEGER,
      },
      sectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Sections', key: 'id' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add a unique constraint to the combination of title and author columns
    await queryInterface.addConstraint('Books', {
      fields: ['title', 'author'],
      type: 'unique',
      name: 'unique_title_author_constraint',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique constraint before dropping the table
    await queryInterface.removeConstraint(
      'Books',
      'unique_title_author_constraint',
    );
    await queryInterface.dropTable('Books');
  },
};
