// cypress/e2e/availability.cy.js
/// <reference types="cypress" />

const primary = require('../../urls/primary.json');
const secondary = require('../../urls/secondary.json');

function addTest(group, url) {
  const okStatuses = Cypress.env('okStatuses') || [200, 201, 202, 204, 301, 302, 303, 304, 307, 308];

  it(`(${group}) ${url}`, () => {
    const started = Date.now();
    cy.request({
      url,
      failOnStatusCode: false,
      timeout: Cypress.env('requestTimeout') || 15000,
      followRedirect: true
    }).then((resp) => {
      const duration = Date.now() - started;
      const ts = new Date().toISOString();
      const line = `${ts},${url},${resp.status},${duration},${group}\n`;
      cy.task('appendCsv', line); // append to dashboard/history.csv
      expect(okStatuses, `OK statuses for ${url}`).to.include(resp.status);
    });
  });
}

describe('URL Availability Monitor', () => {
  // Gera 1 teste por URL logo no carregamento do spec (requisito do Mocha)
  describe('Primary URLs', () => {
    (primary || []).forEach((url) => addTest('primary', url));
  });

  describe('Secondary URLs', () => {
    (secondary || []).forEach((url) => addTest('secondary', url));
  });
});