/* eslint-env mocha */
/* global cy */
describe("Random Describe", () => {
  context("Random Context", () => {
    it("Random It", () => {
      cy.fixture("File").snapshot("Fixture File", {
        humanName: "Random Fixture File"
      });
      // cy.fixture("File2").snapshot("Fixture File",
    });

    // it("works with numbers", () => {
    // console.log(cy.wrap(42))
    // cy.wrap(42).snapshot();
    // });

    // it("works with strings", () => {
    // console.log(cy.wrap("foo-bar"))
    // cy.wrap("foo-bar").snapshot();
    // });

    // it("works with arrays", () => {
    // console.log(cy.wrap([1, 2, 3]))
    // cy.wrap([1, 2, 3]).snapshot();
    // });
  });
});
