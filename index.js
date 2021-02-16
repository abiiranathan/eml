var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
(function () { return __awaiter(_this, void 0, void 0, function () {
    function showSubcategories(subcategories) {
        subcategories.forEach(function (subcategory) {
            var li = document.createElement("li");
            li.className = "list-item";
            li.style.cursor = "pointer";
            var anchor = document.createElement("a");
            anchor.innerHTML = subcategory.subcategory;
            li.appendChild(anchor);
            var tags = document.createElement("div");
            var categoryTag = document.createElement("span");
            tags.className = "tags";
            categoryTag.innerHTML = subcategory.category;
            tags.appendChild(categoryTag);
            li.appendChild(tags);
            // Add corresponding drugs for each subcategory
            var drug_section = document.createElement("div");
            drug_section.className = "category-drugs hidden";
            li.appendChild(drug_section);
            subcategory.drugs.forEach(function (drug) {
                var row = document.createElement("div");
                row.className = "drug-row";
                var title = document.createElement("h3");
                title.innerHTML = drug.name;
                row.appendChild(title);
                var desc = document.createElement("p");
                desc.innerHTML = drug.description;
                row.appendChild(desc);
                drug_section.appendChild(row);
            });
            searchOutput.appendChild(li);
            li.addEventListener("click", function () {
                drug_section.classList.toggle("hidden");
            });
        });
    }
    function showDrugNames(data) {
        data.forEach(function (dataItem) {
            var li = document.createElement("li");
            li.className = "list-item";
            var anchor = document.createElement("a");
            anchor.innerHTML = dataItem.name;
            var desc = document.createElement("p");
            desc.innerHTML = dataItem.description;
            var tags = document.createElement("div");
            var categoryTag = document.createElement("span");
            tags.className = "tags";
            categoryTag.innerHTML = dataItem.category;
            tags.appendChild(categoryTag);
            if (dataItem.subcategory) {
                var subcategoryTag = document.createElement("span");
                subcategoryTag.innerHTML = dataItem.subcategory;
                tags.appendChild(subcategoryTag);
            }
            li.appendChild(anchor);
            li.appendChild(tags);
            li.appendChild(desc);
            searchOutput.appendChild(li);
        });
    }
    function displaySearchResults(data, filterID) {
        output.innerHTML = "";
        searchOutput.innerHTML = "";
        searchOutput.classList.remove("hidden");
        if (filterID === "subcategory") {
            var subcategories_1 = [];
            data.forEach(function (emlSection) {
                emlSection.classes.forEach(function (cls) {
                    if (matchesString(searchInput.value, cls.subcategory)) {
                        var drugs = [];
                        for (var _i = 0, _a = cls.drugs; _i < _a.length; _i++) {
                            var drug = _a[_i];
                            drugs.push({
                                name: drug.name,
                                description: drug.description,
                                subcategory: cls.subcategory,
                                category: emlSection.category
                            });
                        }
                        subcategories_1.push({
                            category: emlSection.category,
                            subcategory: cls.subcategory,
                            drugs: drugs
                        });
                    }
                });
            });
            showSubcategories(subcategories_1);
        }
        else {
            var drugNames_1 = [];
            data.forEach(function (emlSection) {
                emlSection.classes.forEach(function (cls) {
                    cls.drugs.forEach(function (drug) {
                        if (matchesString(searchInput.value, drug.name)) {
                            drugNames_1.push({
                                name: drug.name,
                                description: drug.description,
                                subcategory: cls.subcategory,
                                category: emlSection.category
                            });
                        }
                    });
                });
            });
            showDrugNames(drugNames_1);
        }
    }
    function displayDataInDOM(data) {
        output.innerHTML = "";
        searchOutput.classList.add("hidden");
        data.forEach(function (emlSection, index) {
            var category = new Category(emlSection, index);
            category.setUp();
            category.setUpSubCategories();
            output.appendChild(category.getElement());
            // Add event listners after insertion into the DOM
            category.setEventListeners();
        });
    }
    function handleSearch(query, data) {
        if (query) {
            var matching = data.filter(function (emlSection) {
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
            }
            else {
                displaySearchResults(matching, filterBy.id);
            }
        }
        else {
            displayDataInDOM(data);
        }
    }
    var output, searchInput, searchOutput, filterBy, matchesString, matchesSubcategory, matchesDrugName, Category, SubCategory, DrugSection, fetchData;
    var _this = this;
    return __generator(this, function (_a) {
        output = document.getElementById("content");
        searchInput = document.querySelector("#search input");
        searchOutput = document.querySelector("#search-output");
        filterBy = document.querySelector("input[name='filter'][checked]");
        matchesString = function (query, str) {
            return str.toLowerCase().indexOf(query.toLocaleLowerCase()) > -1;
        };
        matchesSubcategory = function (query, emlSection) {
            return emlSection.classes.some(function (cls) {
                if (!cls.subcategory)
                    return false;
                return matchesString(query, cls.subcategory);
            });
        };
        matchesDrugName = function (query, emlSection) {
            return emlSection.classes.some(function (cls) {
                return cls.drugs.some(function (drug) {
                    return matchesString(query, drug.name);
                });
            });
        };
        Category = /** @class */ (function () {
            function Category(emlSection, index) {
                this.category = document.createElement("li");
                this.emlSection = emlSection;
                this.index = index.toString();
                this.clear();
            }
            Category.prototype.clear = function () {
                this.category.innerHTML = "";
            };
            Category.prototype.getElement = function () {
                return this.category;
            };
            Category.prototype.toggle = function () {
                this.category.classList.toggle("active");
            };
            Category.prototype.setEventListeners = function () {
                var _this = this;
                var categories = document.querySelectorAll(".category");
                this.categoryLink.onclick = function (e) {
                    e.stopPropagation();
                    categories.forEach(function (cat) {
                        if (cat.id === _this.category.id) {
                            _this.toggle();
                            cat.querySelectorAll(".subcategory").forEach(function (subcategory) {
                                subcategory.classList.toggle("hidden");
                            });
                        }
                        else {
                            cat.classList.remove("active");
                            cat.querySelectorAll(".subcategory").forEach(function (subcategory) {
                                subcategory.classList.add("hidden");
                            });
                        }
                    });
                };
            };
            Category.prototype.setUpSubCategories = function () {
                var _this = this;
                this.emlSection.classes.forEach(function (cls) {
                    var subcategory = new SubCategory(cls);
                    subcategory.addDrugs();
                    _this.category.appendChild(subcategory.getElement());
                });
                this.setEventListeners();
            };
            Category.prototype.setUp = function () {
                this.category.className = "category";
                this.category.id = this.index;
                this.categoryLink = document.createElement("a");
                this.categoryLink.innerHTML = this.emlSection.category;
                this.category.appendChild(this.categoryLink);
            };
            return Category;
        }());
        SubCategory = /** @class */ (function () {
            function SubCategory(emlSectionClass) {
                this.emlSectionClass = emlSectionClass;
                this.subcategory = document.createElement("ul");
                this.subcategory.className = "subcategory hidden";
                this.createHeader();
            }
            SubCategory.prototype.createHeader = function () {
                this.header = document.createElement("h3");
                this.header.className = "subcategory__header";
                this.header.innerHTML = this.emlSectionClass.subcategory || "";
                this.subcategory.appendChild(this.header);
            };
            SubCategory.prototype.getElement = function () {
                return this.subcategory;
            };
            SubCategory.prototype.addDrugs = function () {
                var _this = this;
                this.emlSectionClass.drugs.forEach(function (drug) {
                    var drugSection = new DrugSection(drug);
                    _this.subcategory.appendChild(drugSection.getElement());
                    _this.attachListeners();
                });
            };
            SubCategory.prototype.attachListeners = function () {
                var _this = this;
                if (this.emlSectionClass.subcategory) {
                    this.header.onclick = function (e) {
                        e.stopPropagation();
                        var drugSections = _this.subcategory.querySelectorAll(".drug__section");
                        drugSections.forEach(function (sec) { return sec.classList.toggle("hidden"); });
                    };
                }
                else {
                    this.header.remove();
                }
            };
            return SubCategory;
        }());
        DrugSection = /** @class */ (function () {
            function DrugSection(drug) {
                this.drugSection = document.createElement("li");
                this.drug = drug;
                this.drugSection.className = "drug__section";
                this.addDrugName();
                this.addDrugDescription();
            }
            DrugSection.prototype.addDrugName = function () {
                var drugName = document.createElement("h4");
                drugName.className = "drug__name";
                drugName.innerHTML = this.drug.name;
                this.drugSection.appendChild(drugName);
            };
            DrugSection.prototype.addDrugDescription = function () {
                var drugDescription = document.createElement("p");
                drugDescription.className = "drug__description";
                drugDescription.innerHTML = this.drug.description;
                this.drugSection.appendChild(drugDescription);
            };
            DrugSection.prototype.getElement = function () {
                return this.drugSection;
            };
            return DrugSection;
        }());
        fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var eml, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eml = "./src/eml-children-2017.json";
                        return [4 /*yield*/, fetch(eml, { headers: { "content-type": "application/json" } })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3: throw new Error("Unable to fetch EML data!");
                }
            });
        }); };
        fetchData()
            .then(function (data) {
            displayDataInDOM(data);
            searchInput.addEventListener("input", function (e) {
                var query = e.target.value;
                handleSearch(query, data);
            });
            document.getElementById("filter-form").onchange = function (e) {
                filterBy = e.target;
                handleSearch(searchInput.value, data);
            };
        })["catch"](function (err) {
            console.log(err);
            output.innerHTML = "There was an error loading the EML!";
        });
        return [2 /*return*/];
    });
}); })();
