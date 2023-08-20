'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const fictionSection = await queryInterface.rawSelect(
      'Sections',
      {
        where: { name: 'Fiction' },
      },
      ['id'],
    );

    const nonFictionSection = await queryInterface.rawSelect(
      'Sections',
      {
        where: { name: 'Non-fiction' },
      },
      ['id'],
    );

    const childrenSection = await queryInterface.rawSelect(
      'Sections',
      {
        where: { name: 'Children' },
      },
      ['id'],
    );

    const books = [
      // Fiction books
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        date: new Date('1960-07-11'),
        cover:
          'https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg',
        summary:
          'A classic novel about racism and injustice in the American South',
        copies: 1,
        sectionId: fictionSection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        date: new Date('1925-04-10'),
        cover:
          'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
        summary: 'A tale of love, wealth, and excess in 1920s America',
        copies: 3,
        sectionId: fictionSection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Non-fiction books
      {
        title: 'The Immortal Life of Henrietta Lacks',
        author: 'Rebecca Skloot',
        date: new Date('2010-02-02'),
        cover:
          'https://upload.wikimedia.org/wikipedia/en/5/5f/The_Immortal_Life_Henrietta_Lacks_%28cover%29.jpg',
        summary:
          'A true story about the woman whose cells were used without her knowledge to make scientific breakthroughs',
        copies: 10,
        sectionId: nonFictionSection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        date: new Date('2011-01-01'),
        cover:
          'https://upload.wikimedia.org/wikipedia/en/0/06/%E1%B8%B2itsur_toldot_ha-enoshut.jpg',
        summary:
          'A fascinating look at the history of our species and how we got to where we are today',
        copies: 5,
        sectionId: nonFictionSection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Children's books
      {
        title: 'Where the Wild Things Are',
        author: 'Maurice Sendak',
        date: new Date('1963-11-13'),
        cover:
          'https://upload.wikimedia.org/wikipedia/en/8/8d/Where_The_Wild_Things_Are_%28book%29_cover.jpg',
        summary:
          "A beloved children's book about a boy who goes on a wild adventure with some strange creatures",
        copies: 25,
        sectionId: childrenSection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Charlotte's Web",
        author: 'E.B. White',
        date: new Date('1952-10-15'),
        cover:
          'https://upload.wikimedia.org/wikipedia/en/f/fe/CharlotteWeb.png',
        summary:
          'A heartwarming tale about a pig named Wilbur and his friendship with a spider named Charlotte',
        copies: 18,
        sectionId: childrenSection,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Books', books, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  },
};
