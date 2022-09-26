import { faker } from "@faker-js/faker";

Cypress.Commands.add("generate20Recommendation", () => {
  for (let i = 0; i < 20; i++) {
    const recommendation = {
      name: faker.lorem.words(3),
      youtubeLink:
        "https://www.youtube.com/watch?v=T3Y6RRSDm4o&ab_channel=CanaldoPeric%C3%A3o",
    };
    cy.request("POST", "http://localhost:5000/recommendations", recommendation);
  }
});
