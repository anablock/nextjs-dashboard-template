//Server Action that is going to be called when the form is submitted. It receives the form data and creates an invoice.
'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number() //The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
        .gt(0, { message: 'Please enter an amount greater than $0.' }), // Since you are coercing the amount type from string to number, it'll default to zero if the string is empty. Let's tell Zod we always want the amount greater than 0 with the .gt() function.
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select a status.',
    }), // Zod already throws an error if the status field is empty as it expects "pending" or "paid". Let's also add a friendly message if the user doesn't select a status.
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

  export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
   
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
   
    // Insert data into the database
    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
   
    // Revalidate the cache for the invoices page and redirect the user.
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

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    } // Passing the variables to your SQL query.

    revalidatePath('/dashboard/invoices'); // Calling revalidatePath to clear the client cache and make a new server request.
    redirect('/dashboard/invoices'); // Calling redirect to redirect the user to the invoice's page.
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice'); // Uncomment this line to test the error message.  throw an error to test the error message.

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}