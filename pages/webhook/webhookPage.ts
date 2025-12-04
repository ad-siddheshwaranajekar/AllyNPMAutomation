import { Page, Locator } from "@playwright/test";
import { BasePage } from "../basePage";
import { faker } from '@faker-js/faker';

export class WebhookPage extends BasePage {

    readonly menuWebhooksBtn: Locator;
    readonly addWebhookBtn: Locator;
    readonly webhookUrlInput: Locator;
    readonly modulesDropdown: Locator;
    readonly versionDropdown: Locator;

    readonly saveButton: Locator;
    readonly cancelButton: Locator;

    readonly successMessage: Locator;
    readonly duplicateErrorMessage: Locator;    

    constructor(page: Page) {
        super(page);

        this.menuWebhooksBtn = page.getByRole('link', { name: 'Webhooks' });
        this.addWebhookBtn = page.locator('div.button.button-green')
        this.webhookUrlInput = page.locator('#inputUrl');
        this.modulesDropdown = page.getByText('* Select Modules', { exact: true });
        this.versionDropdown = page.locator('#version');

        this.saveButton = page.getByText('Save', { exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });

        this.successMessage = page.getByRole('alert', {
            name: 'Webhook added successfully.',
        });
        this.duplicateErrorMessage =page.getByText('Already  Subscribed  For  This  Module  With URL', { exact: true });
    }

    // Generate dynamic webhook URL (no navigation)
    private generateWebhookUrl(): string {
        const randomNumber = faker.number.int({ min: 1000, max: 9999 });
        return `https://webhook-test.com/${randomNumber}`;
    }

    async setWebhookUrl(url?: string) {
        if (!url) {
            url = this.generateWebhookUrl();
        }
        await this.webhookUrlInput.fill(url);
    }

    // Select modules from dropdown
    async selectModules(...modules: string[]) {
    await this.modulesDropdown.click();

    for (const moduleName of modules) {
        const label = this.page.locator(
            `.dropdown-menu label.custom-check-container:has(span.selectable-option:text-is("${moduleName}"))`
        );

        // Read current state from the hidden checkbox
        const checkbox = label.locator('input[type="checkbox"]');

        if (!(await checkbox.isChecked())) {
            await label.click();  // ← Click visible label instead of hidden input
        }
    }

    await this.page.keyboard.press('Escape');
}

}
