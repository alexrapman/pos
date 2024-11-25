// backend/src/templates/EmailTemplates.ts
import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs/promises';

export class EmailTemplateManager {
    private templates: Map<string, Handlebars.TemplateDelegate> = new Map();
    private readonly templateDir = path.join(__dirname, 'email-templates');

    async loadTemplates() {
        const templates = ['refund', 'payment', 'order'];

        for (const template of templates) {
            const content = await fs.readFile(
                path.join(this.templateDir, `${template}.hbs`),
                'utf-8'
            );
            this.templates.set(template, Handlebars.compile(content));
        }
    }

    getTemplate(type: string, data: any): string {
        const template = this.templates.get(type);
        if (!template) throw new Error(`Template ${type} not found`);
        return template(data);
    }
}

// backend/src/templates/email-templates/refund.hbs
<!DOCTYPE html >
    <html>
    <head>
    <style>
    .container { max - width: 600px; margin: 0 auto; }
    .header { background: #f8f9fa; padding: 20px; }
    .content { padding: 20px; }
</style>
    </head>
    < body >
    <div class="container" >
        <div class="header" >
            <h1>Refund Processed </h1>
                </div>
                < div class="content" >
                    <p>Dear { { order.customerName } }, </p>
                        < p > Your refund for order #{{ order.id }} has been processed.</p>
                            < p > Amount: ${ { payment.amount } } </p>
                                < p > Refund ID: { { payment.metadata.refundId } } </p>
                                    < p > Date: { {formatDate payment.metadata.refundedAt } } </p>
                                        </div>
                                        </div>
                                        </body>
                                        </html>