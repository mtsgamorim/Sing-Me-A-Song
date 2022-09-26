beforeEach(async () => {
  await cy.request("POST", "http://localhost:5000/tests/reset");
});

describe("Testes em criar recomendações", () => {
  it("Caso sucesso: adicionar uma recomendação", () => {
    cy.visit("http://localhost:3000");

    cy.get("[data-cy=name]").type("Música boa");
    cy.get("[data-cy=link]").type(
      "https://www.youtube.com/watch?v=T3Y6RRSDm4o&list=RDT3Y6RRSDm4o&start_radio=1&ab_channel=CanaldoPeric%C3%A3o"
    );

    cy.intercept("POST", "http://localhost:5000/recommendations").as("post");
    cy.intercept("GET", "http://localhost:5000/recommendations").as("get");

    cy.get("[data-cy=submit]").click();
    cy.wait("@post");
    cy.wait("@get");

    cy.get("[data-cy=title]").should("contain", "Música boa");
  });

  it("Caso erro: recomendação ja existe", () => {
    cy.visit("http://localhost:3000");

    cy.get("[data-cy=name]").type("Música boa");
    cy.get("[data-cy=link]").type(
      "https://www.youtube.com/watch?v=T3Y6RRSDm4o&list=RDT3Y6RRSDm4o&start_radio=1&ab_channel=CanaldoPeric%C3%A3o"
    );

    cy.intercept("POST", "http://localhost:5000/recommendations").as("post");
    cy.intercept("GET", "http://localhost:5000/recommendations").as("get");

    cy.get("[data-cy=submit]").click();
    cy.wait("@post");
    cy.wait("@get");

    cy.get("[data-cy=name]").type("Música boa");
    cy.get("[data-cy=link]").type(
      "https://www.youtube.com/watch?v=T3Y6RRSDm4o&list=RDT3Y6RRSDm4o&start_radio=1&ab_channel=CanaldoPeric%C3%A3o"
    );

    cy.get("[data-cy=submit]").click();
    cy.wait("@post");
    cy.wait("@get");

    cy.on("window:alert", (t) => {
      expect(t).to.contains("Error creating recommendation!");
    });
  });
});
