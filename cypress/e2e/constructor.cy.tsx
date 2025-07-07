/// <reference types="cypress" />

import ingredients from './ingredients.json';
import user from './user.json';
import orderSuccess from './order-success.json';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавление булки в конструктор', () => {
      const bun = ingredients.data.find((item) => item.type === 'bun');
      cy.get('.add-button-bun').first().as('bunButton');

      cy.get('@bunButton').click({ force: true });
      cy.get('.constructor-element_pos_top').as('topBun');
      cy.get('.constructor-element_pos_bottom').as('bottomBun');

      cy.get('@topBun').should('contain', bun!.name);
      cy.get('@bottomBun').should('contain', bun!.name);
    });

    it('добавление начинки в конструктор', () => {
      const mainIng = ingredients.data.find((item) => item.type === 'main');
      cy.get('.add-button-main').first().as('mainButton');

      cy.get('@mainButton').click({ force: true });
      cy.get('.constructor-element__row').as('constructorRow');

      cy.get('@constructorRow').should('contain', mainIng!.name);
    });
  });

  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.get('[data-test="ingredient-link"]').first().as('ingredientLink');
    });

    it('открытие модального окна при клике на ингредиент', () => {
      cy.get('@ingredientLink').click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').as('modal');

      cy.get('@modal').should('exist');
    });

    it('закрытие модального окна по кнопке закрытия', () => {
      cy.get('@ingredientLink').click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
      cy.get('#modals').find('[data-test="modal-close-button"]').as('closeButton');

      cy.get('@closeButton').click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('not.exist');
    });

    it('закрытие модального окна по клавише Escape', () => {
      cy.get('@ingredientLink').click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');

      cy.get('body').type('{esc}');
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('not.exist');
    });

    it('закрытие модального окна по клику на оверлей', () => {
      cy.get('@ingredientLink').click();
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
      cy.get('#modals').find('[data-test="modal-overlay"]').as('overlay');

      cy.get('@overlay').click({ force: true });
      cy.get('#modals').find('[data-test="ingredient-modal"]').should('not.exist');
    });
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: { success: true, user: user.user },
    }).as('getUser');

    cy.intercept('POST', '**/orders', (req) => {
      req.reply({
        statusCode: 200,
        body: orderSuccess,
      });
    }).as('createOrder');

    cy.then(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'Bearer fake-access-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем localStorage и cookie после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('успешное оформление заказа', () => {
    cy.get('.add-button-bun').first().as('bunButton');
    cy.get('.add-button-main').first().as('mainButton');
    cy.get('[data-test="order-button"]').first().as('orderButton');

    cy.get('@bunButton').click({ force: true });
    cy.get('@mainButton').click({ force: true });
    cy.get('@orderButton').click({ force: true });

    cy.get('#modals').find('[data-test="order-modal"]').as('orderModal');
    cy.get('@orderModal').should('exist');

    cy.get('[data-test="order-number"]').as('orderNumber');
    cy.get('@orderNumber').should('contain', orderSuccess.order.number);

    cy.get('#modals').find('[data-test="modal-close-button"]').as('closeButton');
    cy.get('@closeButton').click();

    cy.get('@orderModal').should('not.exist');
    cy.get('.constructor-element').should('not.exist');
  });
});