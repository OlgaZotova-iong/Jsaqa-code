const sorting = require("../../app");

describe("Books names test suit", () => {
  it("Books names should be sorted in ascending order", () => {
    expect(
      sorting.sortByName([
        "Гарри Поттер",
        "Властелин Колец",
        "Волшебник изумрудного города",
      ])
    ).toEqual([
      "Властелин Колец",
      "Волшебник изумрудного города",
      "Гарри Поттер",
    ]);
  });

  it("Should not sort if names are identical", () => {
    expect(
      sorting.sortByName([
        "Властелин Колец",
        "Властелин Колец",
      ])
    ).toEqual([
      "Властелин Колец",
      "Властелин Колец",
    ]);
  });

  it("Should sort correctly if names are in reverse order", () => {
    expect(
      sorting.sortByName([
        "Я",
        "А",
      ])
    ).toEqual([
      "А",
      "Я",
    ]);
  });
});

