//Server Action that is going to be called when the form is submitted. It receives the form data and creates an invoice.
'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), //The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) { //Extracting the data from formData.
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'), // Validating the types with Zod.
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Converting the amount to cents.
    const amountInCents = amount * 100;

    await sql` 
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `; // Passing the variables to your SQL query.

    revalidatePath('/dashboard/invoices'); // Calling revalidatePath to clear the client cache and make a new server request.
    redirect('/dashboard/invoices'); // Calling redirect to redirect the user to the invoice's page.
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}