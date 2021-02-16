(async () => {
  const output = document.getElementById("content") as HTMLDivElement;
  const searchInput = document.querySelector("#search input") as HTMLInputElement;
  const searchOutput = document.querySelector("#search-output") as HTMLDivElement;
  let filterBy = document.querySelector("input[name='filter'][checked]") as HTMLInputElement;

  const matchesString = (query: string, str: string) => {
    return str.toLowerCase().indexOf(query.toLocaleLowerCase()) > -1;
  };

  const matchesSubcategory = (query: string | null, emlSection: EMLSection) => {
    return emlSection.classes.some(cls => {
      if (!cls.subcategory) return false;
      return matchesString(query, cls.subcategory);
    });
  };

  const matchesDrugName = (query: string, emlSection: EMLSection) => {
    return emlSection.classes.some(cls => {
      return cls.drugs.some(drug => {
        return matchesString(query, drug.name);
      });
    });
  };

  interface Drug {
    name: string;
    description: string;
  }

  interface EMLSectionClass {
    subcategory: string;
    drugs: Drug[];
  }

  interface EMLSection {
    category: string;
    classes: EMLSectionClass[];
  }

  interface DrugDataItem {
    name: string;
    description: string;
    subcategory: string;
    category: string;
  }

  interface SubcategoryDataItem {
    subcategory: string;
    category: string;
    drugs: DrugDataItem[];
  }

  class Category {
    private category: HTMLLIElement;
    private emlSection: EMLSection;
    private index: string;
    private categoryLink: HTMLAnchorElement;

    constructor(emlSection: EMLSection, index: number) {
      this.category = document.createElement("li");
      this.emlSection = emlSection;
      this.index = index.toString();

      this.clear();
    }

    clear() {
      this.category.innerHTML = "";
    }

    getElement(): HTMLLIElement {
      return this.category;
    }

    private toggle() {
      this.category.classList.toggle("active");
    }

    setEventListeners() {
      const categories = document.querySelectorAll(".category");

      this.categoryLink.onclick = e => {
        e.stopPropagation();

        categories.forEach(cat => {
          if (cat.id === this.category.id) {
            this.toggle();
            cat.querySelectorAll(".subcategory").forEach(subcategory => {
              subcategory.classList.toggle("hidden");
            });
          } else {
            cat.classList.remove("active");
            cat.querySelectorAll(".subcategory").forEach(subcategory => {
              subcategory.classList.add("hidden");
            });
          }
        });
      };
    }

    setUpSubCategories() {
      this.emlSection.classes.forEach(cls => {
        const subcategory = new SubCategory(cls);
        subcategory.addDrugs();
        this.category.appendChild(subcategory.getElement());
      });

      this.setEventListeners();
    }

    setUp() {
      this.category.className = "category";
      this.category.id = this.index;

      this.categoryLink = document.createElement("a");
      this.categoryLink.innerHTML = this.emlSection.category;
      this.categoryLink.title = "Click to expand/collapse";
      this.category.appendChild(this.categoryLink);
    }
  }

  class SubCategory {
    private subcategory: HTMLUListElement;
    private emlSectionClass: EMLSectionClass;
    private header: HTMLHeadingElement;

    constructor(emlSectionClass: EMLSectionClass) {
      this.emlSectionClass = emlSectionClass;
      this.subcategory = document.createElement("ul");

      this.subcategory.className = "subcategory hidden";
      this.createHeader();
    }

    createHeader() {
      this.header = document.createElement("h3");
      this.header.className = "subcategory__header";
      this.header.innerHTML = this.emlSectionClass.subcategory || "";

      this.subcategory.appendChild(this.header);
    }

    getElement() {
      return this.subcategory;
    }

    addDrugs() {
      this.emlSectionClass.drugs.forEach(drug => {
        const drugSection = new DrugSection(drug);
        this.subcategory.appendChild(drugSection.getElement());
        this.attachListeners();
      });
    }

    attachListeners() {
      if (this.emlSectionClass.subcategory) {
        this.header.onclick = e => {
          e.stopPropagation();

          const drugSections = this.subcategory.querySelectorAll(".drug__section");
          drugSections.forEach(sec => sec.classList.toggle("hidden"));
        };
      } else {
        this.header.remove();
      }
    }
  }

  class DrugSection {
    private drug: Drug;
    private drugSection: HTMLLIElement;

    constructor(drug: Drug) {
      this.drugSection = document.createElement("li");
      this.drug = drug;

      this.drugSection.className = "drug__section";

      this.addDrugName();
      this.addDrugDescription();
    }

    private addDrugName() {
      const drugName = document.createElement("h4");
      drugName.className = "drug__name";
      drugName.innerHTML = this.drug.name;

      this.drugSection.appendChild(drugName);
    }

    private addDrugDescription() {
      const drugDescription = document.createElement("p");
      drugDescription.className = "drug__description";
      drugDescription.innerHTML = this.drug.description;

      this.drugSection.appendChild(drugDescription);
    }

    getElement() {
      return this.drugSection;
    }
  }

  const fetchData = async () => {
    const eml = "./src/eml-children-2017.json";
    const res = await fetch(eml, { headers: { "content-type": "application/json" } });

    if (res.ok) {
      const data: EMLSection[] = await res.json();
      return data;
    } else {
      throw new Error("Unable to fetch EML data!");
    }
  };

  function showSubcategories(subcategories: SubcategoryDataItem[]) {
    subcategories.forEach(subcategory => {
      const li = document.createElement("li");
      li.className = "list-item";
      li.style.cursor = "pointer";

      const anchor = document.createElement("a");
      anchor.innerHTML = subcategory.subcategory;
      li.appendChild(anchor);

      const tags = document.createElement("div");
      const categoryTag = document.createElement("span");
      tags.className = "tags";
      categoryTag.innerHTML = subcategory.category;
      tags.appendChild(categoryTag);
      li.appendChild(tags);

      // Add corresponding drugs for each subcategory
      const drug_section = document.createElement("div");
      drug_section.className = "category-drugs hidden";

      li.appendChild(drug_section);

      subcategory.drugs.forEach(drug => {
        const row = document.createElement("div");
        row.className = "drug-row";

        const title = document.createElement("h3");
        title.innerHTML = drug.name;

        row.appendChild(title);

        const desc = document.createElement("p");
        desc.innerHTML = drug.description;
        row.appendChild(desc);
        drug_section.appendChild(row);
      });

      searchOutput.appendChild(li);

      li.addEventListener("click", () => {
        drug_section.classList.toggle("hidden");
      });
    });
  }

  function showDrugNames(data: DrugDataItem[]) {
    data.forEach(dataItem => {
      const li = document.createElement("li");
      li.className = "list-item";

      const anchor = document.createElement("a");
      anchor.innerHTML = dataItem.name;

      const desc = document.createElement("p");
      desc.innerHTML = dataItem.description;

      const tags = document.createElement("div");
      const categoryTag = document.createElement("span");

      tags.className = "tags";
      categoryTag.innerHTML = dataItem.category;

      tags.appendChild(categoryTag);

      if (dataItem.subcategory) {
        const subcategoryTag = document.createElement("span");
        subcategoryTag.innerHTML = dataItem.subcategory;
        tags.appendChild(subcategoryTag);
      }

      li.appendChild(anchor);
      li.appendChild(tags);
      li.appendChild(desc);

      searchOutput.appendChild(li);
    });
  }

  function displaySearchResults(data: EMLSection[], filterID: string) {
    output.innerHTML = "";
    searchOutput.innerHTML = "";
    searchOutput.classList.remove("hidden");

    if (filterID === "subcategory") {
      const subcategories: SubcategoryDataItem[] = [];

      data.forEach(emlSection => {
        emlSection.classes.forEach(cls => {
          if (matchesString(searchInput.value, cls.subcategory)) {
            const drugs = [];
            for (const drug of cls.drugs) {
              drugs.push({
                name: drug.name,
                description: drug.description,
                subcategory: cls.subcategory,
                category: emlSection.category,
              });
            }

            subcategories.push({
              category: emlSection.category,
              subcategory: cls.subcategory,
              drugs: drugs,
            });
          }
        });
      });

      showSubcategories(subcategories);
    } else {
      const drugNames: DrugDataItem[] = [];

      data.forEach(emlSection => {
        emlSection.classes.forEach(cls => {
          cls.drugs.forEach(drug => {
            if (matchesString(searchInput.value, drug.name)) {
              drugNames.push({
                name: drug.name,
                description: drug.description,
                subcategory: cls.subcategory,
                category: emlSection.category,
              });
            }
          });
        });
      });

      showDrugNames(drugNames);
    }
  }

  function displayDataInDOM(data: EMLSection[]) {
    output.innerHTML = "";
    searchOutput.classList.add("hidden");

    data.forEach((emlSection, index) => {
      const category = new Category(emlSection, index);
      category.setUp();
      category.setUpSubCategories();
      output.appendChild(category.getElement());

      // Add event listners after insertion into the DOM
      category.setEventListeners();
    });
  }

  function handleSearch(query: string, data: EMLSection[]) {
    if (query) {
      const matching = data.filter(emlSection => {
        switch (filterBy.id) {
          case "category":
            return matchesString(query, emlSection.category);
          case "subcategory":
            return matchesSubcategory(query, emlSection);
          case "drug":
            return matchesDrugName(query, emlSection);
          default:
            return false;
        }
      });

      if (filterBy.id === "category") {
        displayDataInDOM(matching);
      } else {
        displaySearchResults(matching, filterBy.id);
      }
    } else {
      displayDataInDOM(data);
    }
  }

  fetchData()
    .then(data => {
      displayDataInDOM(data);
      searchInput.addEventListener("input", e => {
        const query = (e.target as HTMLInputElement).value;
        handleSearch(query, data);
      });

      document.getElementById("filter-form").onchange = e => {
        filterBy = e.target as HTMLInputElement;
        handleSearch(searchInput.value, data);
      };
    })
    .catch(err => {
      console.log(err);
      output.innerHTML = "There was an error loading the EML!";
    });
})();
