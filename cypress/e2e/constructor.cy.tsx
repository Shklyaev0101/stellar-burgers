/// <reference types="cypress" />

import ingredients from './ingredients.json';
import user from './user.json';
import orderSuccess from './order-success.json';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавление булки в конструктор', () => {
      const bun = ingredients.data.find((item) => item.type === 'bun');
      cy.get('.add-button-bun').first().click({ force: true });
      cy.get('.constructor-element_pos_top').should('contain', bun!.name);
      cy.get('.constructor-element_pos_bottom').should('contain', bun!.name);
    });

    it('добавление начинки в конструктор', () => {
      const mainIng = ingredients.data.find((item) => item.type === 'main');
      cy.get('.add-button-main').first().click({ force: true });
      cy.get('.constructor-element__row').should('contain', mainIng!.name);
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открытие модального окна при клике на ингредиент', () => {
      cy.get('[data-test="ingredient-link"]').first().click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
    });

    it('закрытие модального окна по кнопке закрытия', () => {
      cy.get('[data-test="ingredient-link"]').first().click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
      cy.get('#modals').find('[data-test="modal-close-button"]').click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('not.exist');
    });

    it('закрытие модального окна по клавише Escape', () => {
      cy.get('[data-test="ingredient-link"]').first().click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
      cy.get('body').type('{esc}');
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('not.exist');
    });

    it('закрытие модального окна по клику на оверлей', () => {
      cy.get('[data-test="ingredient-link"]').first().click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
      cy.get('#modals').find('[data-test="modal-overlay"]').click({ force: true });
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('not.exist');
    });
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: user.user
      }
    }).as('getUser');

    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');

    cy.intercept('POST', '**/orders', (req) => {
      req.reply({
        statusCode: 200,
        body: orderSuccess
      });
    }).as('createOrder');

    cy.then(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'Bearer fake-access-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('успешное оформление заказа', () => {
    cy.get('.add-button-bun').first().click({ force: true });
    cy.get('.add-button-main').first().click({ force: true });
    cy.get('[data-test="order-button"]').first().click({ force: true });

    cy.get('#modals').find('[data-test="order-modal"]').should('exist');
    cy.get('[data-test="order-number"]').should('contain', orderSuccess.order.number);

    cy.get('#modals').find('[data-test="modal-close-button"]').click();
    cy.get('#modals').find('[data-test="order-modal"]').should('not.exist');
    cy.get('.constructor-element').should('not.exist');
  });
});