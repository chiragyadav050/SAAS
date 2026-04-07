import { ClientForm } from "@/components/clients/client-form";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Client</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new client to your account.
        </p>
      </div>
      <ClientForm />
    </div>
  );
}
