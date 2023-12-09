import { Locator, Page } from "@playwright/test";
import {
  ExhaustiveSupplier,
  MinimumSupplier,
  SupplierWithId,
} from "../__mocks__/supplier.mock";
import { readFixture, writeFixture } from "../utils/fixtures";
import { SupplierPage } from "./supplier.page";

const GET_CATEGORIES_TIMEOUT = 1500;

/**
 * Page Object Model for the New Supplier Page.
 * https://playwright.dev/docs/pom
 */
export class NewSupplierPage extends SupplierPage {
  readonly TextFields: {
    readonly companyName: Locator;
    readonly ownerName: Locator;
    readonly alternativeCompanyName: Locator;
    readonly alternativeOwnerName: Locator;
    readonly businessRegistrationNumber: Locator;
    readonly ownerId: Locator;
    readonly registeredBusinessAddress: Locator;
    readonly supplierAddress: Locator;
    readonly dateOfEstablishmentOfCompany: Locator;
    readonly legalPerson: Locator;
    readonly legalPersonId: Locator;
    readonly paidUpCapital: Locator;
    readonly contactPerson: Locator;
    readonly contactNumber: Locator;
    readonly wechatId: Locator;
    readonly emailAddress: Locator;
    readonly supplierWebsite: Locator;
    readonly brandCheckId: Locator;
    readonly accountHolderName: Locator;
    readonly accountNumber: Locator;
    readonly bankName: Locator;
    readonly swiftCode: Locator;
    readonly bankAddress: Locator;
    readonly supplierCompanyAddress: Locator;
  };

  readonly Buttons: {
    readonly countryCode: Locator;
    readonly companyAdditionalInformation: Locator;
    readonly contactAdditionalInformation: Locator;
    readonly addCategory: Locator;
    readonly chooseCategory: Locator;
    readonly chooseSubCategory: Locator;
    readonly add: Locator;
    readonly create: Locator;
    readonly cancel: Locator;
  };

  constructor(page: Page) {
    super(page);

    this.TextFields = {
      companyName: page.getByLabel(/^company name$/i),
      ownerName: page.getByLabel(/^owner name$/i),
      alternativeCompanyName: page.getByLabel(/^alternative company name$/i),
      alternativeOwnerName: page.getByLabel(/^alternative owner name$/i),
      businessRegistrationNumber: page.getByLabel(
        /^business registration no\.$/i,
      ),
      ownerId: page.getByLabel(/^owner id$/i),
      registeredBusinessAddress: page.getByLabel(
        /^registered business address$/i,
      ),
      supplierAddress: page.getByLabel(/^supplier address$/i),
      dateOfEstablishmentOfCompany: page.getByLabel(
        /^date of establishment of company$/i,
      ),
      legalPerson: page.getByLabel(/^legal person$/i),
      legalPersonId: page.getByLabel(/^legal person id$/i),
      paidUpCapital: page.getByLabel(/^paid up capital$/i),

      contactPerson: page.getByLabel(/^contact person$/i),
      contactNumber: page.getByLabel(/^contact number$/i),
      wechatId: page.getByLabel(/^wechat id$/i),
      emailAddress: page.getByLabel(/^email address$/i),
      supplierWebsite: page.getByLabel(/^supplier website$/i),
      brandCheckId: page.getByLabel(/^brand check id$/i),
      accountHolderName: page.getByLabel(/^account holder name$/i),
      accountNumber: page.getByLabel(/^account number$/i),
      bankName: page.getByLabel(/^bank name$/i),
      swiftCode: page.getByLabel(/^swift code$/i),
      bankAddress: page.getByLabel(/^bank address$/i),
      supplierCompanyAddress: page.getByLabel(/^supplier company address$/i),
    };

    this.Buttons = {
      countryCode: page.getByRole("button", {
        name: /^country code china \(\+86\)$/i,
      }),
      companyAdditionalInformation: page
        .getByRole("button", { name: /^additional information$/i })
        .first(),
      contactAdditionalInformation: page
        .getByRole("button", { name: /^additional information$/i })
        .last(),
      addCategory: page.getByRole("button", { name: /^add category$/i }),
      chooseCategory: page.getByRole("button", {
        name: /^category choose category$/i,
      }),
      chooseSubCategory: page.getByRole("button", {
        name: /^sub-category choose category$/i,
      }),
      add: page.getByRole("button", { name: /^add$/i }),
      create: page.getByRole("button", { name: /^create$/i }),
      cancel: page.getByRole("button", { name: /^cancel$/i }),
    };
  }

  async open() {
    await this.page.goto("/suppliers/new");
  }

  async selectCategory(name: string | RegExp) {
    await this.page.getByRole("option", { name }).click();
    await this.page.waitForTimeout(GET_CATEGORIES_TIMEOUT);
  }

  async addCategory([rootCategory, ...childrenCategories]: (
    | string
    | RegExp
  )[]) {
    await this.Buttons.addCategory.click();
    await this.page.waitForTimeout(GET_CATEGORIES_TIMEOUT);

    await this.Buttons.chooseCategory.click();
    await this.selectCategory(rootCategory);

    for (const category of childrenCategories) {
      await this.Buttons.chooseSubCategory.click();
      await this.selectCategory(category);
    }

    await this.page.waitForTimeout(GET_CATEGORIES_TIMEOUT);
    await this.Buttons.add.click();
  }

  async writeSupplierFixture(
    name: string,
    supplier: MinimumSupplier | ExhaustiveSupplier,
  ) {
    const newUrl = await this.page.url();
    const supplierId = newUrl.match(/\/(\d+)/)?.[0].substring(1);
    await writeFixture(`suppliers/${name}.local.json`, {
      supplierId,
      ...supplier,
    });
  }

  async readSupplierFixture(name: string): Promise<SupplierWithId> {
    return JSON.parse(
      await readFixture(`suppliers/${name}.local.json`),
    ) as SupplierWithId;
  }
}
